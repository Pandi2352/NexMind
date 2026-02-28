export const VectorStoreType = {
    PINECONE: 'pinecone',
    CHROMA: 'chroma',
    MILVUS: 'milvus',
    QDRANT: 'qdrant',
    UPSTASH: 'upstash',
} as const;

export type VectorStoreTypeValue = (typeof VectorStoreType)[keyof typeof VectorStoreType];

export interface VectorStore {
    _id: string;
    name: string;
    type: VectorStoreTypeValue;
    baseUrl?: string;
    apiKey?: string;
    indexName?: string;
    tenant?: string;
    database?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVectorStoreDto {
    name: string;
    type: VectorStoreTypeValue;
    baseUrl?: string;
    apiKey?: string;
    indexName?: string;
    tenant?: string;
    database?: string;
}

export interface UpdateVectorStoreDto extends Partial<CreateVectorStoreDto> { }
