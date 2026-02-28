import type { Summary, CreateSummaryDto } from '../types';
import api from './api';

export const summarizerService = {
  summarize(dto: CreateSummaryDto): Promise<Summary> {
    return api.post('/summarizer', dto).then((r) => r.data);
  },

  getAll(): Promise<Summary[]> {
    return api.get('/summarizer').then((r) => r.data);
  },

  getById(id: string): Promise<Summary> {
    return api.get(`/summarizer/${id}`).then((r) => r.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/summarizer/${id}`).then(() => undefined);
  },
};
