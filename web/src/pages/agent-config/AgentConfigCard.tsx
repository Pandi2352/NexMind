import { useState } from 'react';
import type { AiProvider, AgentTypeValue } from '../../types';
import type { AgentConfigView } from '../../hooks/useAgentConfig';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface AgentConfigCardProps {
  config: AgentConfigView;
  providers: AiProvider[];
  onAssign: (agentType: AgentTypeValue, providerId: string) => Promise<void>;
  onRemove: (agentType: AgentTypeValue) => Promise<void>;
}

export function AgentConfigCard({ config, providers, onAssign, onRemove }: AgentConfigCardProps) {
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [busy, setBusy] = useState(false);

  const borderColor = config.provider
    ? config.isFallback ? 'border-l-yellow-500' : 'border-l-green-500'
    : 'border-l-red-500';

  const handleAssign = async () => {
    if (!selectedProviderId) return;
    setBusy(true);
    try {
      await onAssign(config.agentType, selectedProviderId);
      setSelectedProviderId('');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    try {
      await onRemove(config.agentType);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`rounded-lg border border-slate-200 border-l-4 ${borderColor} bg-white p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize text-slate-900">{config.agentType} Agent</h3>
        {config.provider && (
          <StatusBadge
            status={config.isFallback ? 'fallback' : 'assigned'}
            label={config.isFallback ? 'Fallback (Global)' : 'Assigned'}
          />
        )}
        {!config.provider && (
          <StatusBadge status="inactive" label="No Provider" />
        )}
      </div>

      {config.provider ? (
        <div className="mt-3 rounded bg-slate-50 p-3">
          <p className="text-sm font-medium text-slate-700">{config.provider.aiProviderName}</p>
          <p className="text-xs text-slate-500">Model: {config.provider.modelName}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No provider assigned and no global active provider set.</p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <select
          value={selectedProviderId}
          onChange={(e) => setSelectedProviderId(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select a provider...</option>
          {providers.map((p) => (
            <option key={p._id} value={p._id}>
              {p.aiProviderName} — {p.modelName}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={!selectedProviderId || busy}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Assign
        </button>
        {!config.isFallback && config.configId && (
          <button
            onClick={handleRemove}
            disabled={busy}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
