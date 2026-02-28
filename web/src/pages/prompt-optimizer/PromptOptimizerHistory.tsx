import { useState } from 'react';
import type { PromptOptimization } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

interface PromptOptimizerHistoryProps {
  optimizations: PromptOptimization[];
  onDelete: (id: string) => Promise<void>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded px-2 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export function PromptOptimizerHistory({ optimizations, onDelete }: PromptOptimizerHistoryProps) {
  if (optimizations.length === 0) {
    return <EmptyState title="No optimizations yet" description="Optimize a prompt to see your history here" />;
  }

  return (
    <div className="space-y-4">
      {optimizations.map((o) => (
        <div key={o._id} className="group rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {o.purpose && (
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700">{o.purpose}</span>
              )}
              <span>{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            <button
              onClick={() => onDelete(o._id)}
              className="hidden rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 group-hover:block"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Original</p>
                <CopyButton text={o.originalPrompt} />
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-600">{o.originalPrompt}</p>
            </div>

            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">Optimized</p>
                <CopyButton text={o.optimizedPrompt} />
              </div>
              <p className="whitespace-pre-wrap text-sm text-indigo-900">{o.optimizedPrompt}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
