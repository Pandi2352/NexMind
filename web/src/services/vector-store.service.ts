import type { VectorStore, CreateVectorStoreDto, UpdateVectorStoreDto } from '../types';
import api from './api';

export const vectorStoreService = {
    getAll(): Promise<VectorStore[]> {
        return api.get('/vector-store').then((r) => r.data);
    },

    getById(id: string): Promise<VectorStore> {
        return api.get(`/vector-store/${id}`).then((r) => r.data);
    },

    create(dto: CreateVectorStoreDto): Promise<VectorStore> {
        return api.post('/vector-store', dto).then((r) => r.data);
    },

    update(id: string, dto: UpdateVectorStoreDto): Promise<VectorStore> {
        return api.patch(`/vector-store/${id}`, dto).then((r) => r.data);
    },

    delete(id: string): Promise<void> {
        return api.delete(`/vector-store/${id}`).then(() => undefined);
    },
};
