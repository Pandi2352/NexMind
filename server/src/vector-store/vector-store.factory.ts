import { Injectable, BadRequestException } from '@nestjs/common';
import { VectorStoreDocument } from './schemas/vector-store.schema.js';
import { VectorStoreType } from './enums/vector-store-type.enum.js';
import { LangchainService } from '../langchain/langchain.service.js';
import { AgentType } from '../agent-config/enums/agent-type.enum.js';

@Injectable()
export class VectorStoreFactory {
    constructor(private readonly langchainService: LangchainService) { }

    async createVectorStoreClient(config: VectorStoreDocument): Promise<any> {
        const embeddings = await this.langchainService.createEmbeddingsModelForAgent(AgentType.RAG_CHAT);

        switch (config.type) {
            case VectorStoreType.CHROMA: {
                const { Chroma } = await import('@langchain/community/vectorstores/chroma');
                let indexArgs: any = {};

                if (config.apiKey && config.tenant && config.database) {
                    const { CloudClient } = await import('chromadb');
                    const client = new CloudClient({
                        apiKey: config.apiKey,
                        tenant: config.tenant,
                        database: config.database,
                    });
                    indexArgs = { index: client };
                } else {
                    indexArgs = { url: config.baseUrl || 'http://localhost:8000' }
                }

                return new Chroma(embeddings, {
                    collectionName: config.indexName || 'ai-chatbot',
                    ...indexArgs,
                });
            }

            // Implement Pinecone, Milvus, Upstash, Qdrant here later
            default:
                throw new BadRequestException(`Vector store type ${config.type} is not yet implemented.`);
        }
    }
}
