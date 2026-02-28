import { Injectable, BadRequestException, Inject, forwardRef, Logger } from '@nestjs/common';
import { VectorStoreDocument } from './schemas/vector-store.schema.js';
import { VectorStoreType } from './enums/vector-store-type.enum.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';

@Injectable()
export class VectorStoreFactory {
    private readonly logger = new Logger(VectorStoreFactory.name);

    constructor(
        @Inject(forwardRef(() => LangchainService))
        private readonly langchainService: LangchainService
    ) { }

    async createVectorStoreClient(config: VectorStoreDocument): Promise<any> {
        this.logger.log(`Creating vector store client for type: ${config.type}, indexName: ${config.indexName}`);
        try {
            const embeddings = await this.langchainService.createEmbeddingsModelForAgent(AgentType.RAG_CHAT);
            this.logger.log(`Successfully created embeddings model for RAG Agent`);

            switch (config.type) {
                case VectorStoreType.CHROMA: {
                    const { Chroma } = await import('@langchain/community/vectorstores/chroma');
                    let indexArgs: any = {};

                    if (config.apiKey && config.tenant && config.database) {
                        this.logger.log(`Initializing Chroma CloudClient with tenant: ${config.tenant}, database: ${config.database}`);
                        const { CloudClient } = await import('chromadb');
                        const client = new CloudClient({
                            apiKey: config.apiKey,
                            tenant: config.tenant,
                            database: config.database,
                        });
                        indexArgs = { index: client };
                    } else {
                        const defaultUrl = config.baseUrl || 'http://localhost:8000';
                        this.logger.log(`Initializing Chroma Local Client with url: ${defaultUrl}`);
                        indexArgs = { url: defaultUrl }
                    }

                    const collectionName = config.indexName || 'ai-chatbot';
                    this.logger.log(`Using collectionName: ${collectionName} for Chroma`);
                    return new Chroma(embeddings, {
                        collectionName: collectionName,
                        ...indexArgs,
                    });
                }

                // Implement Pinecone, Milvus, Upstash, Qdrant here later
                default:
                    throw new BadRequestException(`Vector store type ${config.type} is not yet implemented.`);
            }
        } catch (error) {
            this.logger.error(`Error creating vector store client: ${error.message}`, error.stack);
            throw error;
        }
    }
}
