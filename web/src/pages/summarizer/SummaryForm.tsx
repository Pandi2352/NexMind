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
  { value: 'eli5', label: 'ELI5 (Explain Like I\'m 5)' },
];

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
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Text to Summarize</label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={6}
            required
            placeholder="Paste an article, document, or any text you want to summarize..."
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Summary Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {styleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={summarizing || !sourceText.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {summarizing ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-medium text-purple-800">Summary ({result.style})</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-purple-900">{result.summaryText}</p>
        </div>
      )}
    </div>
  );
}
