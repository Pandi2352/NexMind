import { useAgentConfig } from "../../hooks/useAgentConfig";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { AgentConfigCard } from "./AgentConfigCard";

export function AgentConfigPage() {
  const {
    agentViews,
    providers,
    activeProvider,
    loading,
    error,
    assign,
    remove,
  } = useAgentConfig();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Agent Configuration
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Assign AI providers to specific agents, or let them fall back to the
          global active provider
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center gap-3 rounded-md border border-slate-200 bg-white px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Global Active Provider
          </p>
          {activeProvider ? (
            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              {activeProvider.aiProviderName}
              <span className="mx-1.5 text-slate-300">·</span>
              <span className="font-normal text-slate-600">
                {activeProvider.modelName}
              </span>
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-slate-500">
              No active provider set. Go to AI Providers to configure one.
            </p>
          )}
        </div>
        {activeProvider && (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {agentViews.map((view) => (
          <AgentConfigCard
            key={view.agentType}
            config={view}
            providers={providers}
            onAssign={assign}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  );
}
