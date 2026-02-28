import type { Translation, CreateTranslationDto } from '../types';
import api from './api';

export const translatorService = {
  translate(dto: CreateTranslationDto): Promise<Translation> {
    return api.post('/translator', dto).then((r) => r.data);
  },

  getAll(): Promise<Translation[]> {
    return api.get('/translator').then((r) => r.data);
  },

  getById(id: string): Promise<Translation> {
    return api.get(`/translator/${id}`).then((r) => r.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/translator/${id}`).then(() => undefined);
  },
};
