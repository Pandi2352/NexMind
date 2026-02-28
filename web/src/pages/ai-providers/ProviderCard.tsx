import { AiProviderName } from '../../types';
import type { AiProvider } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface ProviderCardProps {
  provider: AiProvider;
  onSetActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProviderCard({ provider, onSetActive, onEdit, onDelete }: ProviderCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{provider.aiProviderName}</h3>
            <StatusBadge status={provider.isActive ? 'active' : 'inactive'} label={provider.isActive ? 'Active' : 'Inactive'} />
          </div>
          <p className="mt-1 text-sm text-slate-600">Model: {provider.modelName}</p>
          {provider.baseUrl && <p className="text-sm text-slate-500">URL: {provider.baseUrl}</p>}
          {provider.aiProviderName === AiProviderName.GEMINI && (
            <p className="text-sm text-slate-500">
              API Key: {provider.apiKey ? '••••••••' : <span className="text-amber-600">Not set</span>}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {!provider.isActive && (
          <button onClick={onSetActive} className="rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
            Set Active
          </button>
        )}
        <button onClick={onEdit} className="rounded bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
          Edit
        </button>
        <button onClick={onDelete} className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
          Delete
        </button>
      </div>
    </div>
  );
}
