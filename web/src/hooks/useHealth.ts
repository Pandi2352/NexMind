import { useState, useEffect, useCallback } from 'react';
import type { HealthConsultation, CreateHealthConsultationDto } from '../types';
import { healthService } from '../services/health.service';

export function useHealth() {
  const [consultations, setConsultations] = useState<HealthConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [consulting, setConsulting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthService.getAll();
      setConsultations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const consult = useCallback(async (dto: CreateHealthConsultationDto) => {
    try {
      setConsulting(true);
      setError(null);
      const result = await healthService.consult(dto);
      await fetchAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health consultation failed');
      return null;
    } finally {
      setConsulting(false);
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await healthService.delete(id);
    await fetchAll();
  }, [fetchAll]);

  return { consultations, loading, consulting, error, consult, remove };
}
