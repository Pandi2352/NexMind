import { useState, useEffect } from "react";
import type { VectorStore, CreateVectorStoreDto, UpdateVectorStoreDto, VectorStoreTypeValue } from "../../types";
import { vectorStoreService } from "../../services/vector-store.service";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { ProviderCard } from "./ProviderCard";
import { ProviderForm } from "./ProviderForm";

export function VectorStoresPage() {
  const [stores, setStores] = useState<VectorStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<VectorStore | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VectorStore | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const data = await vectorStoreService.getAll();
      setStores(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load vector stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (dto: CreateVectorStoreDto | UpdateVectorStoreDto) => {
    try {
      if (editing) {
        await vectorStoreService.update(editing._id, dto);
      } else {
        await vectorStoreService.create(dto as CreateVectorStoreDto);
      }
      setShowForm(false);
      setEditing(null);
      loadStores();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save vector store');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await vectorStoreService.delete(id);
      loadStores();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete vector store');
    }
  };

  if (loading && stores.length === 0) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vector Stores</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your vector store connections for RAG
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Store
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
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
              {editing ? "Edit Vector Store" : "Add New Vector Store"}
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

      {stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16">
          <h3 className="mt-5 text-base font-semibold text-slate-800">
            No vector stores yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Add a vector store to get started with RAG
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
          >
            Add Store
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((p) => (
            <ProviderCard
              key={p._id}
              store={p}
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
        title="Delete Vector Store"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleteTarget) await handleRemove(deleteTarget._id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
