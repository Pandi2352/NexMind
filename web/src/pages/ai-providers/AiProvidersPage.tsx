import { useState } from "react";
import type {
  AiProvider,
  CreateAiProviderDto,
  UpdateAiProviderDto,
} from "../../types";
import { useAiProviders } from "../../hooks/useAiProviders";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { ProviderCard } from "./ProviderCard";
import { ProviderForm } from "./ProviderForm";

export function AiProvidersPage() {
  const { providers, loading, error, create, update, setActive, remove } =
    useAiProviders();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AiProvider | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AiProvider | null>(null);

  const handleSubmit = async (
    dto: CreateAiProviderDto | UpdateAiProviderDto,
  ) => {
    if (editing) {
      await update(editing._id, dto);
    } else {
      await create(dto as CreateAiProviderDto);
    }
    setShowForm(false);
    setEditing(null);
  };

  if (loading) return <LoadingSpinner />;

  const activeProvider = providers.find((p) => p.isActive);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Providers</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your language model configurations
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Provider
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeProvider && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">
              {activeProvider.aiProviderName}
            </span>
            <span className="mx-1.5 text-emerald-400">·</span>
            {activeProvider.modelName} is the active provider
          </p>
        </div>
      )}

      {(showForm || editing) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowForm(false);
            setEditing(null);
          }}
        >
          <div
            className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-6 text-lg font-bold text-slate-900">
              {editing ? "Edit Provider" : "Add New Provider"}
            </h3>
            <ProviderForm
              initial={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}

      {providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-800">
            No providers yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Add an AI provider to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110"
          >
            Add Provider
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <ProviderCard
              key={p._id}
              provider={p}
              onSetActive={() => setActive(p._id)}
              onEdit={() => {
                setEditing(p);
                setShowForm(true);
              }}
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
        onConfirm={async () => {
          if (deleteTarget) await remove(deleteTarget._id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
