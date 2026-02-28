import { useState } from 'react';
import type { Summary } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

interface SummaryHistoryProps {
  summaries: Summary[];
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
      className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="text-emerald-600">Copied!</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export function SummaryHistory({ summaries, onDelete }: SummaryHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (summaries.length === 0) {
    return <EmptyState title="No summaries yet" description="Summarize some text to see your history here" />;
  }

  return (
    <div className="space-y-3">
      {summaries.map((s) => {
        const isOpen = expandedId === s._id;
        return (
          <div key={s._id} className="group rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md hover:shadow-slate-100">
            {/* Accordion header */}
            <button
              type="button"
              onClick={() => setExpandedId(isOpen ? null : s._id)}
              className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left"
            >
              {/* Expand/collapse chevron */}
              <svg
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>

              {/* Summary preview */}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium text-slate-800 ${isOpen ? '' : 'truncate'}`}>
                  {s.summaryText}
                </p>
              </div>

              {/* Style badge + date */}
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                  {s.style || 'concise'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="border-t border-slate-100 px-5 py-4">
                {/* Source text */}
                <div className="mb-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Source Text</p>
                    <CopyButton text={s.sourceText} />
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-50 p-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{s.sourceText}</p>
                  </div>
                </div>

                {/* Summary result */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-500">Summary</p>
                    <CopyButton text={s.summaryText} />
                  </div>
                  <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-violet-900">{s.summaryText}</p>
                  </div>
                </div>

                {/* Delete button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onDelete(s._id)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
