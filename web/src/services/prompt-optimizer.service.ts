import type { PromptOptimization, CreatePromptOptimizationDto } from '../types';
import api from './api';

export const promptOptimizerService = {
  optimize(dto: CreatePromptOptimizationDto): Promise<PromptOptimization> {
    return api.post('/prompt-optimizer', dto).then((r) => r.data);
  },

  getAll(): Promise<PromptOptimization[]> {
    return api.get('/prompt-optimizer').then((r) => r.data);
  },

  getById(id: string): Promise<PromptOptimization> {
    return api.get(`/prompt-optimizer/${id}`).then((r) => r.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/prompt-optimizer/${id}`).then(() => undefined);
  },
};
