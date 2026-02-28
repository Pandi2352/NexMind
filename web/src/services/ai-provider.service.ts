import type { AiProvider, CreateAiProviderDto, UpdateAiProviderDto } from '../types';
import api from './api';

export const aiProviderService = {
  getAll(): Promise<AiProvider[]> {
    return api.get('/ai-provider').then((r) => r.data);
  },

  getById(id: string): Promise<AiProvider> {
    return api.get(`/ai-provider/${id}`).then((r) => r.data);
  },

  getActive(): Promise<AiProvider> {
    return api.get('/ai-provider/active/current').then((r) => r.data);
  },

  create(dto: CreateAiProviderDto): Promise<AiProvider> {
    return api.post('/ai-provider', dto).then((r) => r.data);
  },

  update(id: string, dto: UpdateAiProviderDto): Promise<AiProvider> {
    return api.patch(`/ai-provider/${id}`, dto).then((r) => r.data);
  },

  setActive(id: string): Promise<AiProvider> {
    return api.patch(`/ai-provider/${id}/set-active`).then((r) => r.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/ai-provider/${id}`).then(() => undefined);
  },
};
