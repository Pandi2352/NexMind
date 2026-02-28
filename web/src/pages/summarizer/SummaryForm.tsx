import { useState } from 'react';
import type { CreateSummaryDto, Summary } from '../../types';

interface SummaryFormProps {
  summarizing: boolean;
  onSummarize: (dto: CreateSummaryDto) => Promise<Summary | null>;
}

const styleOptions = [
  { value: '', label: 'Default (concise)' },
  { value: 'bullet-points', label: 'Bullet Points' },
  { value: 'one-paragraph', label: 'One Paragraph' },
  { value: 'tldr', label: 'TL;DR' },
  { value: 'eli5', label: "ELI5 (Explain Like I'm 5)" },
];

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
      className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-violet-400 transition-colors hover:bg-violet-100 hover:text-violet-600"
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

export function SummaryForm({ summarizing, onSummarize }: SummaryFormProps) {
  const [sourceText, setSourceText] = useState('');
  const [style, setStyle] = useState('');
  const [result, setResult] = useState<Summary | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onSummarize({
      sourceText,
      style: style || undefined,
    });
    if (res) setResult(res);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Text to Summarize</label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={6}
            required
            placeholder="Paste an article, document, or any text you want to summarize..."
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Summary Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-1 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            {styleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={summarizing || !sourceText.trim()}
          className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {summarizing ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>

      {result && (
        <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-500">
              Summary — {result.style || 'concise'}
            </p>
            <CopyButton text={result.summaryText} />
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-violet-900">{result.summaryText}</p>
        </div>
      )}
    </div>
  );
}
