import { useState } from 'react';
import type { AiProvider, CreateAiProviderDto, UpdateAiProviderDto } from '../../types';
import { useAiProviders } from '../../hooks/useAiProviders';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ProviderCard } from './ProviderCard';
import { ProviderForm } from './ProviderForm';

export function AiProvidersPage() {
  const { providers, loading, error, create, update, setActive, remove } = useAiProviders();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AiProvider | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AiProvider | null>(null);

  const handleSubmit = async (dto: CreateAiProviderDto | UpdateAiProviderDto) => {
    if (editing) {
      await update(editing._id, dto);
    } else {
      await create(dto as CreateAiProviderDto);
    }
    setShowForm(false);
    setEditing(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Providers</h2>
          <p className="text-sm text-slate-500">Manage your AI provider configurations</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Provider
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {(showForm || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">{editing ? 'Edit Provider' : 'Add Provider'}</h3>
            <ProviderForm
              initial={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        </div>
      )}

      {providers.length === 0 ? (
        <EmptyState
          title="No providers yet"
          description="Add an AI provider to get started"
          actionLabel="Add Provider"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <ProviderCard
              key={p._id}
              provider={p}
              onSetActive={() => setActive(p._id)}
              onEdit={() => { setEditing(p); setShowForm(true); }}
              onDelete={() => setDeleteTarget(p)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Provider"
        message={`Are you sure you want to delete "${deleteTarget?.aiProviderName} - ${deleteTarget?.modelName}"?`}
        confirmLabel="Delete"
        onConfirm={async () => { if (deleteTarget) await remove(deleteTarget._id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
