import { useState, useEffect, useCallback } from 'react';
import type { AiProvider, CreateAiProviderDto, UpdateAiProviderDto } from '../types';
import { aiProviderService } from '../services/ai-provider.service';

export function useAiProviders() {
  const [providers, setProviders] = useState<AiProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiProviderService.getAll();
      setProviders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (dto: CreateAiProviderDto) => {
    await aiProviderService.create(dto);
    await fetch();
  }, [fetch]);

  const update = useCallback(async (id: string, dto: UpdateAiProviderDto) => {
    await aiProviderService.update(id, dto);
    await fetch();
  }, [fetch]);

  const setActive = useCallback(async (id: string) => {
    await aiProviderService.setActive(id);
    await fetch();
  }, [fetch]);

  const remove = useCallback(async (id: string) => {
    await aiProviderService.delete(id);
    await fetch();
  }, [fetch]);

  return { providers, loading, error, fetch, create, update, setActive, remove };
}
