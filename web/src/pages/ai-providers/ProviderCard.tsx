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
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">{provider.aiProviderName}</h3>
            <StatusBadge status={provider.isActive ? 'active' : 'inactive'} label={provider.isActive ? 'Active' : 'Inactive'} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-20 text-slate-500">Model</span>
              <span className="font-medium text-slate-900">{provider.modelName}</span>
            </div>
            
            {provider.baseUrl && (
              <div className="flex items-center text-sm">
                <span className="w-20 text-slate-500">URL</span>
                <span className="truncate text-slate-700">{provider.baseUrl}</span>
              </div>
            )}
            
            {provider.aiProviderName === AiProviderName.GEMINI && (
              <div className="flex items-center text-sm">
                <span className="w-20 text-slate-500">API Key</span>
                <span>{provider.apiKey ? '••••••••' : <span className="text-amber-600 font-medium">Not set</span>}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
        {!provider.isActive && (
          <button 
            onClick={onSetActive} 
            className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Set Active
          </button>
        )}
        <button 
          onClick={onEdit} 
          className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          Edit
        </button>
        <button 
          onClick={onDelete} 
          className="flex-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
