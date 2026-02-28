import { useState, useEffect, useCallback } from 'react';
import type { Translation, CreateTranslationDto } from '../types';
import { translatorService } from '../services/translator.service';

export function useTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<Translation | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await translatorService.getAll();
      setTranslations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch translations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const translate = useCallback(async (dto: CreateTranslationDto) => {
    try {
      setTranslating(true);
      setError(null);
      const result = await translatorService.translate(dto);
      setLastResult(result);
      await fetchAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      return null;
    } finally {
      setTranslating(false);
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await translatorService.delete(id);
    await fetchAll();
  }, [fetchAll]);

  return { translations, loading, translating, error, lastResult, translate, remove };
}
