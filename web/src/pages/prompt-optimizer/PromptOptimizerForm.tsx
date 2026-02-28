import { useState } from 'react';
import type { CreatePromptOptimizationDto, PromptOptimization } from '../../types';

interface PromptOptimizerFormProps {
  optimizing: boolean;
  onOptimize: (dto: CreatePromptOptimizationDto) => Promise<PromptOptimization | null>;
}

export function PromptOptimizerForm({ optimizing, onOptimize }: PromptOptimizerFormProps) {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [purpose, setPurpose] = useState('');
  const [result, setResult] = useState<PromptOptimization | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onOptimize({
      originalPrompt,
      purpose: purpose || undefined,
    });
    if (res) setResult(res);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Original Prompt</label>
          <textarea
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            rows={4}
            required
            placeholder="Enter your prompt to optimize..."
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Purpose (optional)</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Code generation, Creative writing, Data analysis..."
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={optimizing || !originalPrompt.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {optimizing ? 'Optimizing...' : 'Optimize Prompt'}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-indigo-800">Optimized Prompt</p>
            <button
              onClick={handleCopy}
              className="rounded px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-indigo-900">{result.optimizedPrompt}</p>
        </div>
      )}
    </div>
  );
}
