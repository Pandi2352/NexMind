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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">AI Providers</h2>
          <p className="mt-2 text-sm text-slate-500">Manage and configure your language models and APIs</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Provider
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {(showForm || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md transform overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all">
            <h3 className="mb-6 text-xl font-semibold tracking-tight text-slate-900">
              {editing ? 'Edit Provider' : 'Add New Provider'}
            </h3>
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
          title="No providers found"
          description="You haven't configured any AI providers yet. Add one to get started."
          actionLabel="Add Provider"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
