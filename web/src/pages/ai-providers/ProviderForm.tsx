import { useState } from "react";
import { AiProviderName } from "../../types";
import type {
  AiProviderNameType,
  AiProvider,
  CreateAiProviderDto,
  UpdateAiProviderDto,
} from "../../types";

interface ProviderFormProps {
  initial?: AiProvider;
  onSubmit: (dto: CreateAiProviderDto | UpdateAiProviderDto) => Promise<void>;
  onCancel: () => void;
}

const providerOptions: {
  value: AiProviderNameType;
  label: string;
  desc: string;
}[] = [
  {
    value: AiProviderName.OLLAMA_LOCAL,
    label: "Ollama Local",
    desc: "Local instance at localhost:11434",
  },
  {
    value: AiProviderName.OLLAMA_CLOUD,
    label: "Ollama Cloud",
    desc: "Remote Ollama with custom URL",
  },
  { value: AiProviderName.GEMINI, label: "Gemini", desc: "Google Gemini API" },
];

export function ProviderForm({
  initial,
  onSubmit,
  onCancel,
}: ProviderFormProps) {
  const isEditing = !!initial;
  const [providerName, setProviderName] = useState<AiProviderNameType>(
    initial?.aiProviderName ?? AiProviderName.OLLAMA_LOCAL,
  );
  const [modelName, setModelName] = useState(initial?.modelName ?? "");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl ?? "");
  const [submitting, setSubmitting] = useState(false);

  const needsApiKey = providerName === AiProviderName.GEMINI;
  const needsBaseUrl = providerName === AiProviderName.OLLAMA_CLOUD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        const dto: UpdateAiProviderDto = {};
        if (providerName !== initial.aiProviderName)
          dto.aiProviderName = providerName;
        if (modelName !== initial.modelName) dto.modelName = modelName;
        if (apiKey) dto.apiKey = apiKey;
        if (needsBaseUrl && baseUrl !== initial.baseUrl) dto.baseUrl = baseUrl;
        await onSubmit(dto);
      } else {
        const dto: CreateAiProviderDto = {
          aiProviderName: providerName,
          modelName,
        };
        if (needsApiKey && apiKey) dto.apiKey = apiKey;
        if (needsBaseUrl && baseUrl) dto.baseUrl = baseUrl;
        await onSubmit(dto);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Provider Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {providerOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setProviderName(opt.value)}
              className={`rounded-md border-2 px-3 py-3 text-left transition-all cursor-pointer ${
                providerName === opt.value
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <p
                className={`text-xs font-semibold ${providerName === opt.value ? "text-blue-700" : "text-slate-800"}`}
              >
                {opt.label}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500 leading-tight">
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Model Name
        </label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="e.g. llama3.2 or gemini-2.0-flash"
          required
          className="block w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {needsApiKey && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              isEditing
                ? "Leave blank to keep existing key"
                : "Enter your Gemini API key"
            }
            className="block w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {isEditing && (
            <p className="mt-1.5 text-xs text-slate-500">
              Only fill this if you want to change the API key
            </p>
          )}
        </div>
      )}

      {needsBaseUrl && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Base URL
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-ollama-instance.com"
            className="block w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors bg-gray-100 cursor-pointer hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2.5 text-sm cursor-pointer font-semibold text-white transition-all hover:shadow-blue-500/40 hover:brightness-110 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEditing
              ? "Update Provider"
              : "Create Provider"}
        </button>
      </div>
    </form>
  );
}
