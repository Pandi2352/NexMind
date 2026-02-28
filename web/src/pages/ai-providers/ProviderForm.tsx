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

  const inputClasses = "mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700">Provider Type</label>
        <div className="relative">
          <select
            value={providerName}
            onChange={(e) => setProviderName(e.target.value as AiProviderNameType)}
            className={`${inputClasses} appearance-none pr-10`}
          >
            {providerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 top-2 flex items-center px-4 text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Model Name</label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="e.g. llama3.2 or gemini-2.0-flash"
          required
          className={inputClasses}
        />
      </div>

      {needsApiKey && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-medium text-slate-700">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={isEditing ? 'Leave blank to keep existing key' : 'Enter your API key'}
            className={inputClasses}
          />
          {isEditing && (
            <p className="mt-2 text-xs text-slate-500">Only fill this if you want to change the API key</p>
          )}
        </div>
      )}

      {needsBaseUrl && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-medium text-slate-700">Base URL</label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-ollama-instance.com"
            className={inputClasses}
          />
        </div>
      )}

      <div className="mt-8 border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEditing ? 'Update Provider' : 'Create Provider'}
        </button>
      </div>
    </form>
  );
}
