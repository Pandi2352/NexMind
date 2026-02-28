import { useState } from 'react';
import { AiProviderName } from '../../types';
import type { AiProviderNameType, AiProvider, CreateAiProviderDto, UpdateAiProviderDto } from '../../types';

interface ProviderFormProps {
  initial?: AiProvider;
  onSubmit: (dto: CreateAiProviderDto | UpdateAiProviderDto) => Promise<void>;
  onCancel: () => void;
}

const providerOptions: { value: AiProviderNameType; label: string }[] = [
  { value: AiProviderName.OLLAMA_LOCAL, label: 'Ollama Local' },
  { value: AiProviderName.OLLAMA_CLOUD, label: 'Ollama Cloud' },
  { value: AiProviderName.GEMINI, label: 'Gemini' },
];

export function ProviderForm({ initial, onSubmit, onCancel }: ProviderFormProps) {
  const isEditing = !!initial;
  const [providerName, setProviderName] = useState<AiProviderNameType>(initial?.aiProviderName ?? AiProviderName.OLLAMA_LOCAL);
  const [modelName, setModelName] = useState(initial?.modelName ?? '');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl ?? '');
  const [submitting, setSubmitting] = useState(false);

  const needsApiKey = providerName === AiProviderName.GEMINI;
  const needsBaseUrl = providerName === AiProviderName.OLLAMA_CLOUD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        const dto: UpdateAiProviderDto = {};
        if (providerName !== initial.aiProviderName) dto.aiProviderName = providerName;
        if (modelName !== initial.modelName) dto.modelName = modelName;
        if (apiKey) dto.apiKey = apiKey;
        if (needsBaseUrl && baseUrl !== initial.baseUrl) dto.baseUrl = baseUrl;
        await onSubmit(dto);
      } else {
        const dto: CreateAiProviderDto = { aiProviderName: providerName, modelName };
        if (needsApiKey && apiKey) dto.apiKey = apiKey;
        if (needsBaseUrl && baseUrl) dto.baseUrl = baseUrl;
        await onSubmit(dto);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Provider</label>
        <select
          value={providerName}
          onChange={(e) => setProviderName(e.target.value as AiProviderNameType)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {providerOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Model Name</label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="e.g. llama3.2 or gemini-2.0-flash"
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {needsApiKey && (
        <div>
          <label className="block text-sm font-medium text-slate-700">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={isEditing ? 'Leave blank to keep existing key' : 'Gemini API key'}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {isEditing && (
            <p className="mt-1 text-xs text-slate-500">Only fill this if you want to change the API key</p>
          )}
        </div>
      )}

      {needsBaseUrl && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Base URL</label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-ollama-instance.com"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
