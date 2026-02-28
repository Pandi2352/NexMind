import { useState, useEffect, useCallback } from 'react';
import type { PromptOptimization, CreatePromptOptimizationDto } from '../types';
import { promptOptimizerService } from '../services/prompt-optimizer.service';

export function usePromptOptimizer() {
  const [optimizations, setOptimizations] = useState<PromptOptimization[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<PromptOptimization | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promptOptimizerService.getAll();
      setOptimizations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch optimizations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const optimize = useCallback(async (dto: CreatePromptOptimizationDto) => {
    try {
      setOptimizing(true);
      setError(null);
      const result = await promptOptimizerService.optimize(dto);
      setLastResult(result);
      await fetchAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed');
      return null;
    } finally {
      setOptimizing(false);
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    await promptOptimizerService.delete(id);
    await fetchAll();
  }, [fetchAll]);

  return { optimizations, loading, optimizing, error, lastResult, optimize, remove };
}
