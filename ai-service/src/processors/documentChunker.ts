import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { logger } from '../utils/logger';

export interface ChunkingConfig {
  chunkSize: number;
  chunkOverlap: number;
  separators?: string[];
  keepSeparator?: boolean;
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    sourceType: 'document' | 'website';
    chunkIndex: number;
    totalChunks: number;
    startChar: number;
    endChar: number;
    [key: string]: any;
  };
}

export class DocumentChunker {
  private static readonly DEFAULT_CONFIG: ChunkingConfig = {
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', ' ', ''],
    keepSeparator: false
  };

  // Different chunking strategies for different content types
  private static readonly CHUNKING_STRATEGIES: Record<string, ChunkingConfig> = {
    // For technical documentation
    technical: {
      chunkSize: 1500,
      chunkOverlap: 300,
      separators: ['\n## ', '\n### ', '\n\n', '\n', ' ', ''],
      keepSeparator: true
    },
    
    // For conversational content
    conversational: {
      chunkSize: 800,
      chunkOverlap: 150,
      separators: ['\n\n', '. ', '! ', '? ', '\n', ' ', ''],
      keepSeparator: false
    },
    
    // For code documentation
    code: {
      chunkSize: 2000,
      chunkOverlap: 400,
      separators: ['\n```', '\n\n', '\nclass ', '\nfunction ', '\ndef ', '\n', ' ', ''],
      keepSeparator: true
    },
    
    // For FAQ content
    faq: {
      chunkSize: 600,
      chunkOverlap: 100,
      separators: ['\nQ:', '\nA:', '\n\n', '\n', ' ', ''],
      keepSeparator: true
    },
    
    // For web content
    web: {
      chunkSize: 1200,
      chunkOverlap: 240,
      separators: ['\n\n', '\n', '. ', ' ', ''],
      keepSeparator: false
    }
  };

  static async chunkDocument(
    content: string,
    metadata: {
      source: string;
      sourceType: 'document' | 'website';
      contentType?: string;
      [key: string]: any;
    }
  ): Promise<DocumentChunk[]> {
    try {
      // Determine chunking strategy based on content type
      const strategy = this.determineChunkingStrategy(content, metadata.contentType);
      const config = this.CHUNKING_STRATEGIES[strategy] || this.DEFAULT_CONFIG;

      logger.info(`Chunking document with strategy: ${strategy}`, {
        source: metadata.source,
        contentLength: content.length,
        chunkSize: config.chunkSize,
        chunkOverlap: config.chunkOverlap
      });

      // Create text splitter with configuration
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: config.chunkSize,
        chunkOverlap: config.chunkOverlap,
        separators: config.separators,
        keepSeparator: config.keepSeparator
      });

      // Split the text
      const docs = await textSplitter.createDocuments([content], [metadata]);
      
      // Convert to our chunk format with enhanced metadata
      const chunks: DocumentChunk[] = docs.map((doc, index) => {
        const startChar = this.findChunkStartPosition(content, doc.pageContent, index);
        const endChar = startChar + doc.pageContent.length;

        return {
          id: `${metadata.source}_chunk_${index}`,
          content: doc.pageContent,
          metadata: {
            ...metadata,
            chunkIndex: index,
            totalChunks: docs.length,
            startChar,
            endChar,
            chunkSize: doc.pageContent.length,
            strategy,
            createdAt: new Date().toISOString()
          }
        };
      });

      // Quality checks
      this.validateChunks(chunks, content);

      logger.info(`Document chunked successfully`, {
        source: metadata.source,
        totalChunks: chunks.length,
        averageChunkSize: chunks.reduce((sum, chunk) => sum + chunk.content.length, 0) / chunks.length
      });

      return chunks;

    } catch (error) {
      logger.error('Document chunking failed:', error);
      throw new Error(`Failed to chunk document: ${error.message}`);
    }
  }

  private static determineChunkingStrategy(content: string, contentType?: string): string {
    // Check for code patterns
    if (this.hasCodePatterns(content)) {
      return 'code';
    }

    // Check for FAQ patterns
    if (this.hasFAQPatterns(content)) {
      return 'faq';
    }

    // Check for technical documentation patterns
    if (this.hasTechnicalPatterns(content)) {
      return 'technical';
    }

    // Check content type
    if (contentType) {
      if (contentType.includes('html') || contentType.includes('web')) {
        return 'web';
      }
    }

    // Default to conversational for general content
    return 'conversational';
  }

  private static hasCodePatterns(content: string): boolean {
    const codePatterns = [
      /```[\s\S]*?```/g, // Code blocks
      /function\s+\w+\s*\(/g, // Function definitions
      /class\s+\w+/g, // Class definitions
      /def\s+\w+\s*\(/g, // Python function definitions
      /import\s+[\w.]+/g, // Import statements
      /#include\s*<[\w.]+>/g // C/C++ includes
    ];

    return codePatterns.some(pattern => pattern.test(content));
  }

  private static hasFAQPatterns(content: string): boolean {
    const faqPatterns = [
      /Q:\s*.*?\n.*?A:\s*/gi,
      /Question:\s*.*?\n.*?Answer:\s*/gi,
      /\d+\.\s*.*?\?.*?\n.*?Answer:/gi
    ];

    return faqPatterns.some(pattern => pattern.test(content));
  }

  private static hasTechnicalPatterns(content: string): boolean {
    const technicalPatterns = [
      /#{1,6}\s+/g, // Markdown headers
      /\*\*[^*]+\*\*/g, // Bold text (often used in docs)
      /API|SDK|REST|GraphQL|JSON|XML/gi, // Technical terms
      /\b(GET|POST|PUT|DELETE|PATCH)\b/g // HTTP methods
    ];

    return technicalPatterns.some(pattern => pattern.test(content));
  }

  private static findChunkStartPosition(fullContent: string, chunkContent: string, chunkIndex: number): number {
    // Simple approach - find the first occurrence after previous chunks
    const searchStart = chunkIndex === 0 ? 0 : fullContent.indexOf(chunkContent);
    return Math.max(0, searchStart);
  }

  private static validateChunks(chunks: DocumentChunk[], originalContent: string): void {
    if (chunks.length === 0) {
      throw new Error('No chunks generated from content');
    }

    // Check for empty chunks
    const emptyChunks = chunks.filter(chunk => chunk.content.trim().length === 0);
    if (emptyChunks.length > 0) {
      logger.warn(`Found ${emptyChunks.length} empty chunks`);
    }

    // Check for very small chunks (might indicate poor chunking)
    const smallChunks = chunks.filter(chunk => chunk.content.length < 50);
    if (smallChunks.length > chunks.length * 0.2) { // More than 20% are small
      logger.warn(`High number of small chunks detected: ${smallChunks.length}/${chunks.length}`);
    }

    // Check total content preservation
    const totalChunkLength = chunks.reduce((sum, chunk) => sum + chunk.content.length, 0);
    const compressionRatio = totalChunkLength / originalContent.length;
    
    if (compressionRatio < 0.8) {
      logger.warn(`Significant content loss detected. Compression ratio: ${compressionRatio.toFixed(2)}`);
    }
  }

  // Method to re-chunk existing content with new strategy
  static async rechunkWithStrategy(
    chunks: DocumentChunk[],
    newStrategy: string
  ): Promise<DocumentChunk[]> {
    // Reconstruct original content
    const originalContent = chunks
      .sort((a, b) => a.metadata.chunkIndex - b.metadata.chunkIndex)
      .map(chunk => chunk.content)
      .join(' ');

    // Get original metadata
    const originalMetadata = {
      source: chunks[0].metadata.source,
      sourceType: chunks[0].metadata.sourceType,
      contentType: newStrategy
    };

    // Re-chunk with new strategy
    return this.chunkDocument(originalContent, originalMetadata);
  }

  // Method to get optimal chunk size based on content analysis
  static analyzeOptimalChunkSize(content: string): ChunkingConfig {
    const contentLength = content.length;
    const avgSentenceLength = this.calculateAverageSentenceLength(content);
    const avgParagraphLength = this.calculateAverageParagraphLength(content);

    let chunkSize: number;
    let chunkOverlap: number;

    if (contentLength < 5000) {
      // Small documents - use smaller chunks
      chunkSize = Math.min(800, Math.max(400, avgParagraphLength * 2));
      chunkOverlap = Math.floor(chunkSize * 0.15);
    } else if (contentLength < 20000) {
      // Medium documents
      chunkSize = Math.min(1200, Math.max(600, avgParagraphLength * 3));
      chunkOverlap = Math.floor(chunkSize * 0.2);
    } else {
      // Large documents
      chunkSize = Math.min(1500, Math.max(800, avgParagraphLength * 4));
      chunkOverlap = Math.floor(chunkSize * 0.25);
    }

    return {
      chunkSize,
      chunkOverlap,
      separators: ['\n\n', '\n', '. ', ' ', ''],
      keepSeparator: false
    };
  }

  private static calculateAverageSentenceLength(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 100; // Default fallback
    
    const totalLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0);
    return Math.floor(totalLength / sentences.length);
  }

  private static calculateAverageParagraphLength(content: string): number {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length === 0) return 300; // Default fallback
    
    const totalLength = paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0);
    return Math.floor(totalLength / paragraphs.length);
  }
}