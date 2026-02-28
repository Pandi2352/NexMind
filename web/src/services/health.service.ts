import type { HealthConsultation, CreateHealthConsultationDto } from '../types';
import api from './api';

export const healthService = {
  consult(dto: CreateHealthConsultationDto): Promise<HealthConsultation> {
    return api.post('/health', dto).then((r) => r.data);
  },

  getAll(): Promise<HealthConsultation[]> {
    return api.get('/health').then((r) => r.data);
  },

  getById(id: string): Promise<HealthConsultation> {
    return api.get(`/health/${id}`).then((r) => r.data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/health/${id}`).then(() => undefined);
  },
};
