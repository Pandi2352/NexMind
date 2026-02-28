import { useState, useEffect, useCallback } from 'react';
import type { AgentConfig, AiProvider, AgentTypeValue, VectorStore } from '../types';
import { AgentType } from '../types';
import { agentConfigService } from '../services/agent-config.service';
import { aiProviderService } from '../services/ai-provider.service';
import { vectorStoreService } from '../services/vector-store.service';

export interface AgentConfigView {
  agentType: AgentTypeValue;
  provider: AiProvider | null;
  vectorStore: VectorStore | null;
  isFallback: boolean;
  configId: string | null;
}

export function useAgentConfig() {
  const [configs, setConfigs] = useState<AgentConfig[]>([]);
  const [providers, setProviders] = useState<AiProvider[]>([]);
  const [vectorStores, setVectorStores] = useState<VectorStore[]>([]);
  const [activeProvider, setActiveProvider] = useState<AiProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [cfgs, provs, vStores] = await Promise.all([
        agentConfigService.getAll(),
        aiProviderService.getAll(),
        vectorStoreService.getAll(),
      ]);
      setConfigs(cfgs);
      setProviders(provs);
      setVectorStores(vStores);
      const active = provs.find((p) => p.isActive) ?? null;
      setActiveProvider(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const agentViews: AgentConfigView[] = Object.values(AgentType).map((type) => {
    const cfg = configs.find((c) => c.agentType === type);
    if (cfg) {
      const provider = providers.find((p) => p._id === cfg.aiProviderId) ?? null;
      const vectorStore = cfg.vectorStoreId ? (vectorStores.find((v) => v._id === cfg.vectorStoreId) ?? null) : null;
      return { agentType: type, provider, vectorStore, isFallback: false, configId: cfg._id };
    }
    return { agentType: type, provider: activeProvider, vectorStore: null, isFallback: true, configId: null };
  });

  const assign = useCallback(async (agentType: AgentTypeValue, aiProviderId: string, vectorStoreId?: string) => {
    await agentConfigService.assign({ agentType, aiProviderId, vectorStoreId });
    await fetch();
  }, [fetch]);

  const remove = useCallback(async (agentType: AgentTypeValue) => {
    await agentConfigService.removeAssignment(agentType);
    await fetch();
  }, [fetch]);

  return { agentViews, providers, vectorStores, activeProvider, loading, error, assign, remove, fetch };
}
