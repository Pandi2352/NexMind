import { useState } from 'react';
import type { CreateTranslationDto, Translation } from '../../types';

interface TranslationFormProps {
  translating: boolean;
  onTranslate: (dto: CreateTranslationDto) => Promise<Translation | null>;
}

export function TranslationForm({ translating, onTranslate }: TranslationFormProps) {
  const [sourceText, setSourceText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [result, setResult] = useState<Translation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onTranslate({
      sourceText,
      targetLanguage,
      sourceLanguage: sourceLanguage || undefined,
    });
    if (res) setResult(res);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Source Text</label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={4}
            required
            placeholder="Enter text to translate..."
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Source Language</label>
            <input
              type="text"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              placeholder="auto-detect"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Target Language</label>
            <input
              type="text"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              placeholder="e.g. Tamil, Spanish"
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={translating || !sourceText.trim() || !targetLanguage.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {translating ? 'Translating...' : 'Translate'}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm font-medium text-green-800">Translation Result</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-green-900">{result.translatedText}</p>
        </div>
      )}
    </div>
  );
}
