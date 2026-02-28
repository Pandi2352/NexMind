import { AiProviderName } from "../../types";
import type { AiProvider } from "../../types";

interface ProviderCardProps {
  provider: AiProvider;
  onSetActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const providerTheme = {
  [AiProviderName.OLLAMA_LOCAL]: {
    gradient: "from-orange-400 to-amber-600",
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: "O",
  },
  [AiProviderName.OLLAMA_CLOUD]: {
    gradient: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    icon: "C",
  },
  [AiProviderName.GEMINI]: {
    gradient: "from-sky-400 to-blue-600",
    bg: "bg-sky-50",
    text: "text-sky-700",
    icon: "G",
  },
} as const;

export function ProviderCard({
  provider,
  onSetActive,
  onEdit,
  onDelete,
}: ProviderCardProps) {
  const theme =
    providerTheme[provider.aiProviderName] ??
    providerTheme[AiProviderName.OLLAMA_LOCAL];

  return (
    <div className="group relative overflow-hidden rounded-md border border-slate-200 bg-white transition-all hover:shadow-lg hover:shadow-slate-200/50">
      <div className={`h-1 bg-gradient-to-r ${theme.gradient}`} />

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${theme.gradient} text-sm font-bold text-white shadow-sm`}
          >
            {theme.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {provider.aiProviderName}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {provider.modelName}
            </p>
          </div>
          {provider.isActive ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              Inactive
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 rounded-md bg-slate-50 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Model</span>
            <span className="font-medium text-slate-700">
              {provider.modelName}
            </span>
          </div>
          {provider.baseUrl && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">URL</span>
              <span className="max-w-[180px] truncate font-medium text-slate-700">
                {provider.baseUrl}
              </span>
            </div>
          )}
          {provider.aiProviderName === AiProviderName.GEMINI && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">API Key</span>
              <span className="font-medium">
                {provider.apiKey ? (
                  <span className="text-slate-700">••••••••</span>
                ) : (
                  <span className="text-amber-600">Not set</span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {!provider.isActive && (
            <button
              onClick={onSetActive}
              className="flex-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
            >
              Set Active
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-md border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
