import { useState } from "react";
import type { VectorStore, CreateVectorStoreDto } from "../../types";

type Props = {
  initial?: VectorStore;
  onSubmit: (dto: CreateVectorStoreDto) => void;
  onCancel: () => void;
};

export function ProviderForm({ initial, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<CreateVectorStoreDto>({
    name: initial?.name || "",
    type: initial?.type || "chroma",
    baseUrl: initial?.baseUrl || "",
    apiKey: initial?.apiKey || "",
    indexName: initial?.indexName || "",
    tenant: initial?.tenant || "",
    database: initial?.database || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 sm:text-sm outline-none"
        >
          <option value="chroma">Chroma DB</option>
          <option value="pinecone">Pinecone</option>
          <option value="milvus">Milvus</option>
          <option value="qdrant">Qdrant</option>
          <option value="upstash">Upstash</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 sm:text-sm outline-none"
        />
      </div>
      {(formData.type === 'pinecone' || formData.type === 'chroma' || formData.type === 'qdrant' || formData.type === 'upstash') && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700">Base URL (optional)</label>
            <input
              name="baseUrl"
              type="text"
              value={formData.baseUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 sm:text-sm outline-none"
            />
          </div>
        </>
      )}
      {(formData.type === 'pinecone' || formData.type === 'chroma' || formData.type === 'qdrant' || formData.type === 'upstash') && (
        <>
         <div>
            <label className="block text-sm font-medium text-slate-700">API Key (optional)</label>
            <input
              name="apiKey"
              type="text"
              value={formData.apiKey}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 sm:text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Index Name / Collection (optional)</label>
            <input
              name="indexName"
              type="text"
              value={formData.indexName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 sm:text-sm outline-none"
            />
          </div>
        </>
      )}
      {(formData.type === 'chroma') && (
        <>
          <div>
             <label className="block text-sm font-medium text-slate-700">Tenant (optional)</label>
             <input
               name="tenant"
               type="text"
               value={formData.tenant || ""}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 sm:text-sm outline-none"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700">Database (optional)</label>
             <input
               name="database"
               type="text"
               value={formData.database || ""}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 sm:text-sm outline-none"
             />
           </div>
        </>
      )}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
        >
          {initial ? "Save Changes" : "Add Store"}
        </button>
      </div>
    </form>
  );
}
