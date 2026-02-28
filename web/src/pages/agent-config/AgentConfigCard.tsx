import { useState, useRef, useEffect } from "react";
import type { AiProvider, AgentTypeValue, VectorStore } from "../../types";
import type { AgentConfigView } from "../../hooks/useAgentConfig";

interface AgentConfigCardProps {
  config: AgentConfigView;
  providers: AiProvider[];
  vectorStores: VectorStore[];
  onAssign: (agentType: AgentTypeValue, providerId: string, vectorStoreId?: string) => Promise<void>;
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
  health: {
    gradient: "from-rose-500 to-pink-600",
    icon: "🩺",
    desc: "Symptom analysis & health guidance",
  },
  "rag-chat": {
    gradient: "from-cyan-500 to-blue-600",
    icon: "🧠",
    desc: "Conversational agent connected to Vector store memory",
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
  vectorStores,
  onAssign,
  onRemove,
}: AgentConfigCardProps) {
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [selectedVectorStoreId, setSelectedVectorStoreId] = useState("");
  const [busy, setBusy] = useState(false);
  
  // dropdown states
  const [pDropdownOpen, setPDropdownOpen] = useState(false);
  const [vDropdownOpen, setVDropdownOpen] = useState(false);

  const pDropdownRef = useRef<HTMLDivElement>(null);
  const vDropdownRef = useRef<HTMLDivElement>(null);

  const meta = agentMeta[config.agentType] ?? fallbackMeta;
  const isRag = config.agentType === "rag-chat";

  const selectedProvider = providers.find((p) => p._id === selectedProviderId);
  const selectedVS = vectorStores.find((v) => v._id === selectedVectorStoreId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pDropdownRef.current && !pDropdownRef.current.contains(e.target as Node)) {
        setPDropdownOpen(false);
      }
      if (vDropdownRef.current && !vDropdownRef.current.contains(e.target as Node)) {
        setVDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAssign = async () => {
    if (!selectedProviderId) return;
    setBusy(true);
    try {
      await onAssign(config.agentType, selectedProviderId, selectedVectorStoreId || undefined);
      setSelectedProviderId("");
      setSelectedVectorStoreId("");
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
              {config.agentType.replace('-', ' ')} Agent
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
          <div className="mt-4 flex flex-col gap-2 rounded-md bg-slate-50 p-3">
            <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">
                    <span className="text-slate-400 mr-2 text-xs uppercase tracking-wider">LLM:</span>
                    {config.provider.aiProviderName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                    {config.provider.modelName}
                </p>
                </div>
                {config.isFallback && (
                <p className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-amber-600">
                    Global Active
                </p>
                )}
            </div>
            {isRag && (
                <div className="flex items-start gap-3 border-t border-slate-200 pt-2 mt-1">
                    <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-800">
                        <span className="text-slate-400 mr-2 text-[10px] uppercase tracking-wider">Vector Store:</span>
                        {config.vectorStore?.name || "None configured"}
                    </p>
                    {config.vectorStore && (
                      <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
                        {config.vectorStore.type}
                      </p>
                    )}
                    </div>
                </div>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-400">
              No provider assigned — set a global active provider or assign one below
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1" ref={pDropdownRef}>
            <button
              type="button"
              onClick={() => setPDropdownOpen((o) => !o)}
              className={`flex w-full cursor-pointer justify-between rounded-md border px-3 py-2 text-left text-sm transition-all ${
                pDropdownOpen ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"
              } ${selectedProvider ? "text-slate-800" : "text-slate-400"}`}
            >
              <div className="flex items-center gap-2 truncate whitespace-nowrap overflow-hidden">
                {selectedProvider ? (
                    <>
                    <span className="truncate font-medium">
                        {selectedProvider.aiProviderName}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="truncate text-slate-500 text-xs">
                        {selectedProvider.modelName}
                    </span>
                    </>
                ) : (
                    <span>Select LLM</span>
                )}
              </div>
            </button>
            {pDropdownOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                {providers.map((p) => (
                    <button
                        key={p._id}
                        type="button"
                        onClick={() => { setSelectedProviderId(p._id); setPDropdownOpen(false); }}
                        className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{p.aiProviderName}</p>
                            <p className="truncate text-[11px] text-slate-400">{p.modelName}</p>
                        </div>
                    </button>
                ))}
              </div>
            )}
          </div>

          {isRag && (
            <div className="relative flex-1" ref={vDropdownRef}>
            <button
                type="button"
                onClick={() => setVDropdownOpen((o) => !o)}
                className={`flex w-full cursor-pointer justify-between rounded-md border px-3 py-2 text-left text-sm transition-all ${
                vDropdownOpen ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"
                } ${selectedVS ? "text-slate-800" : "text-slate-400"}`}
            >
                <div className="flex items-center gap-2 truncate whitespace-nowrap overflow-hidden">
                {selectedVS ? (
                    <>
                    <span className="truncate font-medium text-xs">
                        {selectedVS.name}
                    </span>
                    </>
                ) : (
                    <span className="text-xs">Select Vector</span>
                )}
                </div>
            </button>
            {vDropdownOpen && (
                <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                <button
                    onClick={() => { setSelectedVectorStoreId(""); setVDropdownOpen(false); }}
                    className="flex w-full cursor-pointer px-3 py-2 text-left text-xs text-slate-500 hover:bg-slate-50"
                >
                    None
                </button>
                {vectorStores.map((v) => (
                    <button
                        key={v._id}
                        type="button"
                        onClick={() => { setSelectedVectorStoreId(v._id); setVDropdownOpen(false); }}
                        className="flex w-full flex-col cursor-pointer px-3 py-2 text-left hover:bg-slate-50"
                    >
                        <span className="truncate text-sm font-medium">{v.name}</span>
                        <span className="truncate text-[10px] text-slate-400 uppercase tracking-widest">{v.type}</span>
                    </button>
                ))}
                </div>
            )}
            </div>
          )}
          
          <button
            onClick={handleAssign}
            disabled={!selectedProviderId || busy}
            className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-50"
          >
            Assign
          </button>
          {!config.isFallback && config.configId && (
            <button
              onClick={handleRemove}
              disabled={busy}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
