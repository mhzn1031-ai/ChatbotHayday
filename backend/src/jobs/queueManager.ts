import Bull from 'bull';
import { logger } from '../utils/logger';
import { DocumentProcessor } from './processors/documentProcessor';
import { WebScrapingService } from './processors/webScrapingService';
import { EmbeddingService } from './processors/embeddingService';
import { prisma } from '../config/database';

// Initialize Redis connection for Bull
const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  }
};

// Job queues for different types of processing
export const documentQueue = new Bull('document processing', redisConfig);
export const embeddingQueue = new Bull('embedding generation', redisConfig);
export const webScrapingQueue = new Bull('web scraping', redisConfig);
export const reindexQueue = new Bull('reindexing', redisConfig);

// Initialize processors
const documentProcessor = new DocumentProcessor();
const webScrapingService = new WebScrapingService();
const embeddingService = new EmbeddingService();

// Document processing job
documentQueue.process('process-document', async (job) => {
  const { documentId, filePath, botId, userId } = job.data;
  
  try {
    logger.info(`Processing document ${documentId} for bot ${botId}`);
    
    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' }
    });

    // Process the document
    const result = await documentProcessor.processDocument(documentId, filePath, botId);
    
    // Update status to completed
    await prisma.document.update({
      where: { id: documentId },
      data: { 
        status: 'COMPLETED',
        mongoId: result.mongoId
      }
    });

    // Trigger embedding generation
    await embeddingQueue.add('generate-embeddings', {
      documentId,
      botId,
      chunks: result.chunks
    });

    logger.info(`Document ${documentId} processed successfully`);
    return result;

  } catch (error) {
    logger.error(`Document processing failed for ${documentId}:`, error);
    
    // Update status to failed
    await prisma.document.update({
      where: { id: documentId },
      data: { 
        status: 'FAILED',
        error: error.message
      }
    });

    throw error;
  }
});

// Web scraping job
webScrapingQueue.process('scrape-website', async (job) => {
  const { websiteId, url, botId } = job.data;
  
  try {
    logger.info(`Scraping website ${url} for bot ${botId}`);
    
    // Update status to processing
    await prisma.website.update({
      where: { id: websiteId },
      data: { status: 'PROCESSING' }
    });

    // Scrape the website
    const result = await webScrapingService.scrapeWebsite(websiteId, url, botId);
    
    // Update status to completed
    await prisma.website.update({
      where: { id: websiteId },
      data: { 
        status: 'COMPLETED',
        mongoId: result.mongoId,
        lastScraped: new Date()
      }
    });

    // Trigger embedding generation
    await embeddingQueue.add('generate-embeddings', {
      websiteId,
      botId,
      chunks: result.chunks
    });

    logger.info(`Website ${url} scraped successfully`);
    return result;

  } catch (error) {
    logger.error(`Web scraping failed for ${url}:`, error);
    
    // Update status to failed
    await prisma.website.update({
      where: { id: websiteId },
      data: { 
        status: 'FAILED',
        error: error.message
      }
    });

    throw error;
  }
});

// Embedding generation job
embeddingQueue.process('generate-embeddings', async (job) => {
  const { documentId, websiteId, botId, chunks } = job.data;
  
  try {
    logger.info(`Generating embeddings for ${documentId || websiteId}`);
    
    // Get bot configuration for embedding settings
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: { config: true }
    });

    if (!bot?.config) {
      throw new Error('Bot configuration not found');
    }

    const provider = bot.config.embeddingProvider as 'openai' | 'cohere';
    
    // Generate embeddings in batches
    const embeddings = await embeddingService.batchGenerateEmbeddings(
      chunks.map((chunk: any) => chunk.content),
      provider,
      50 // batch size
    );

    // Store embeddings in vector database
    await embeddingService.storeEmbeddings(botId, chunks, embeddings);

    logger.info(`Embeddings generated successfully for ${documentId || websiteId}`);
    return { success: true, embeddingCount: embeddings.length };

  } catch (error) {
    logger.error(`Embedding generation failed:`, error);
    throw error;
  }
});

// Reindexing job for when bot knowledge sources change
reindexQueue.process('reindex-bot', async (job) => {
  const { botId } = job.data;
  
  try {
    logger.info(`Reindexing bot ${botId}`);
    
    // Get all documents and websites for the bot
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        documents: { where: { status: 'COMPLETED' } },
        websites: { where: { status: 'COMPLETED' } },
        config: true
      }
    });

    if (!bot) {
      throw new Error('Bot not found');
    }

    // Clear existing embeddings
    await embeddingService.clearBotEmbeddings(botId);

    // Reprocess all documents and websites
    for (const document of bot.documents) {
      await embeddingQueue.add('generate-embeddings', {
        documentId: document.id,
        botId,
        chunks: await documentProcessor.getDocumentChunks(document.mongoId!)
      });
    }

    for (const website of bot.websites) {
      await embeddingQueue.add('generate-embeddings', {
        websiteId: website.id,
        botId,
        chunks: await webScrapingService.getWebsiteChunks(website.mongoId!)
      });
    }

    logger.info(`Bot ${botId} reindexing completed`);
    return { success: true };

  } catch (error) {
    logger.error(`Reindexing failed for bot ${botId}:`, error);
    throw error;
  }
});

// Job progress tracking
export const getJobProgress = async (jobId: string, queueName: string) => {
  let queue;
  switch (queueName) {
    case 'document':
      queue = documentQueue;
      break;
    case 'embedding':
      queue = embeddingQueue;
      break;
    case 'webscraping':
      queue = webScrapingQueue;
      break;
    case 'reindex':
      queue = reindexQueue;
      break;
    default:
      throw new Error('Invalid queue name');
  }

  const job = await queue.getJob(jobId);
  if (!job) {
    return null;
  }

  return {
    id: job.id,
    progress: job.progress(),
    state: await job.getState(),
    data: job.data,
    createdAt: new Date(job.timestamp),
    processedAt: job.processedOn ? new Date(job.processedOn) : null,
    finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
    failedReason: job.failedReason
  };
};

// Queue monitoring and cleanup
export const setupQueueMonitoring = () => {
  const queues = [documentQueue, embeddingQueue, webScrapingQueue, reindexQueue];
  
  queues.forEach(queue => {
    queue.on('completed', (job) => {
      logger.info(`Job ${job.id} completed in queue ${queue.name}`);
    });

    queue.on('failed', (job, err) => {
      logger.error(`Job ${job.id} failed in queue ${queue.name}:`, err);
    });

    queue.on('stalled', (job) => {
      logger.warn(`Job ${job.id} stalled in queue ${queue.name}`);
    });
  });

  // Clean up old jobs every hour
  setInterval(async () => {
    for (const queue of queues) {
      await queue.clean(24 * 60 * 60 * 1000, 'completed'); // Remove completed jobs older than 24h
      await queue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // Remove failed jobs older than 7 days
    }
  }, 60 * 60 * 1000);
};