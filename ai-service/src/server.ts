import express from 'express';
import dotenv from 'dotenv';
import { DocumentProcessor } from './processors/documentProcessor';
import { EmbeddingService } from './embeddings/embeddingService';
import { RAGService } from './services/ragService';
import { WebScrapingService } from './services/webScrapingService';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.AI_SERVICE_PORT || 3002;

app.use(express.json());

// Initialize services
const documentProcessor = new DocumentProcessor();
const embeddingService = new EmbeddingService();
const ragService = new RAGService(embeddingService);
const webScrapingService = new WebScrapingService();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'AI Service' });
});

// Process document endpoint
app.post('/process-document', async (req, res) => {
  try {
    const { documentId, filePath, botId } = req.body;
    
    logger.info(`Processing document ${documentId} for bot ${botId}`);
    
    const result = await documentProcessor.processDocument(
      documentId,
      filePath,
      botId
    );
    
    res.json({ success: true, result });
  } catch (error) {
    logger.error('Document processing failed:', error);
    res.status(500).json({ error: 'Document processing failed' });
  }
});

// Process website endpoint
app.post('/process-website', async (req, res) => {
  try {
    const { websiteId, url, botId } = req.body;
    
    logger.info(`Processing website ${url} for bot ${botId}`);
    
    const result = await webScrapingService.scrapeWebsite(
      websiteId,
      url,
      botId
    );
    
    res.json({ success: true, result });
  } catch (error) {
    logger.error('Website processing failed:', error);
    res.status(500).json({ error: 'Website processing failed' });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { botId, message, conversationId } = req.body;
    
    logger.info(`Processing chat for bot ${botId}`);
    
    const response = await ragService.generateResponse(
      botId,
      message,
      conversationId
    );
    
    res.json({ response });
  } catch (error) {
    logger.error('Chat processing failed:', error);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

// Generate embeddings endpoint
app.post('/embeddings', async (req, res) => {
  try {
    const { text, provider = 'openai' } = req.body;
    
    const embeddings = await embeddingService.generateEmbeddings(text, provider);
    
    res.json({ embeddings });
  } catch (error) {
    logger.error('Embedding generation failed:', error);
    res.status(500).json({ error: 'Embedding generation failed' });
  }
});

app.listen(PORT, () => {
  logger.info(`AI Service running on port ${PORT}`);
});