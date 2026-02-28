import { useState, useEffect, useCallback } from 'react';
import type { Summary, CreateSummaryDto } from '../types';
import { summarizerService } from '../services/summarizer.service';

export function useSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<Summary | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await summarizerService.getAll();
      setSummaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summaries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const summarize = useCallback(async (dto: CreateSummaryDto) => {
    try {
      setSummarizing(true);
      setError(null);
      const result = await summarizerService.summarize(dto);
      setLastResult(result);
      await fetchAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Summarization failed');
      return null;
    } finally {
      setSummarizing(false);
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await summarizerService.delete(id);
    await fetchAll();
  }, [fetchAll]);

  return { summaries, loading, summarizing, error, lastResult, summarize, remove };
}
