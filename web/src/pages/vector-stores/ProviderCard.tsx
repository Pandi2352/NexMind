import type { VectorStore } from "../../types";

type Props = {
  store: VectorStore;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProviderCard({ store, onEdit, onDelete }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{store.name}</h3>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{store.type}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
          >
             {/* Edit Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
          >
            {/* Delete Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2 mt-4 text-sm">
        {store.baseUrl && (
          <div className="flex justify-between border-t border-slate-100 pt-2">
            <span className="text-slate-500">Base URL</span>
            <span className="text-slate-900 truncate max-w-[150px]" title={store.baseUrl}>{store.baseUrl}</span>
          </div>
        )}
        {store.indexName && (
          <div className="flex justify-between border-t border-slate-100 pt-2">
            <span className="text-slate-500">Index</span>
            <span className="text-slate-900">{store.indexName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
