import { useAgentConfig } from '../../hooks/useAgentConfig';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { AgentConfigCard } from './AgentConfigCard';

export function AgentConfigPage() {
  const { agentViews, providers, activeProvider, loading, error, assign, remove } = useAgentConfig();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Agent Configuration</h2>
        <p className="text-sm text-slate-500">Assign AI providers to specific agent types, or let them fall back to the global active provider</p>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-900">Global Active Provider</p>
        {activeProvider ? (
          <p className="mt-1 text-sm text-blue-700">
            {activeProvider.aiProviderName} — {activeProvider.modelName}
          </p>
        ) : (
          <p className="mt-1 text-sm text-blue-600">No active provider set. Go to AI Providers to set one.</p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {agentViews.map((view) => (
          <AgentConfigCard
            key={view.agentType}
            config={view}
            providers={providers}
            onAssign={assign}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  );
}
