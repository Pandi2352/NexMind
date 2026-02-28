import { useState, useRef, useEffect } from "react";
import type { AiProvider, AgentTypeValue } from "../../types";
import type { AgentConfigView } from "../../hooks/useAgentConfig";

interface AgentConfigCardProps {
  config: AgentConfigView;
  providers: AiProvider[];
  onAssign: (agentType: AgentTypeValue, providerId: string) => Promise<void>;
  onRemove: (agentType: AgentTypeValue) => Promise<void>;
}

const agentMeta: Record<
  string,
  { gradient: string; icon: string; desc: string }
> = {
  chat: {
    gradient: "from-blue-500 to-indigo-600",
    icon: "💬",
    desc: "Conversational AI chatbot",
  },
  translator: {
    gradient: "from-emerald-500 to-teal-600",
    icon: "🌐",
    desc: "Multi-language text translation",
  },
  summarizer: {
    gradient: "from-violet-500 to-purple-600",
    icon: "📝",
    desc: "Text summarization engine",
  },
  "prompt-optimizer": {
    gradient: "from-amber-500 to-orange-600",
    icon: "✨",
    desc: "Prompt rewriting & refinement",
  },
};

const fallbackMeta = {
  gradient: "from-slate-400 to-slate-500",
  icon: "🤖",
  desc: "AI agent",
};

export function AgentConfigCard({
  config,
  providers,
  onAssign,
  onRemove,
}: AgentConfigCardProps) {
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [busy, setBusy] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const meta = agentMeta[config.agentType] ?? fallbackMeta;
  const selectedProvider = providers.find((p) => p._id === selectedProviderId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAssign = async () => {
    if (!selectedProviderId) return;
    setBusy(true);
    try {
      await onAssign(config.agentType, selectedProviderId);
      setSelectedProviderId("");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    try {
      await onRemove(config.agentType);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white transition-all hover:shadow-lg hover:shadow-slate-200/50">
      <div className={`h-1 rounded-t-xl bg-gradient-to-r ${meta.gradient}`} />

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${meta.gradient} text-lg shadow-sm`}
          >
            {meta.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold capitalize text-slate-900">
              {config.agentType} Agent
            </h3>
            <p className="text-xs text-slate-500">{meta.desc}</p>
          </div>

          {config.provider ? (
            config.isFallback ? (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Fallback
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Assigned
              </span>
            )
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              None
            </span>
          )}
        </div>

        {config.provider ? (
          <div className="mt-4 flex items-center gap-3 rounded-md bg-slate-50 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800">
                {config.provider.aiProviderName}
              </p>
              <p className="text-xs text-slate-500">
                {config.provider.modelName}
              </p>
            </div>
            {config.isFallback && (
              <p className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-amber-600">
                Global Active
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-400">
              No provider assigned — set a global active provider or assign one
              below
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          {/* Custom dropdown */}
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-all ${
                dropdownOpen
                  ? "border-blue-400 ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-slate-300"
              } ${selectedProvider ? "text-slate-800" : "text-slate-400"}`}
            >
              {selectedProvider ? (
                <span className="flex items-center gap-2 truncate">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
                    {selectedProvider.aiProviderName.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate font-medium">
                    {selectedProvider.aiProviderName}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="truncate text-slate-500">
                    {selectedProvider.modelName}
                  </span>
                </span>
              ) : (
                <span>Select a provider...</span>
              )}
              <svg
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                {providers.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-400">
                    No providers available
                  </div>
                ) : (
                  providers.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => {
                        setSelectedProviderId(p._id);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                        selectedProviderId === p._id
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${
                          selectedProviderId === p._id
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                            : "bg-slate-300"
                        }`}
                      >
                        {p.aiProviderName.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {p.aiProviderName}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                          {p.modelName}
                        </p>
                      </div>
                      {selectedProviderId === p._id && (
                        <svg
                          className="h-4 w-4 shrink-0 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAssign}
            disabled={!selectedProviderId || busy}
            className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Assign
          </button>
          {!config.isFallback && config.configId && (
            <button
              onClick={handleRemove}
              disabled={busy}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
