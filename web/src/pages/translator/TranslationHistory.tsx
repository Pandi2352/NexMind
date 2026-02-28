import type { Translation } from '../../types';
import { EmptyState } from '../../components/ui/EmptyState';

interface TranslationHistoryProps {
  translations: Translation[];
  onDelete: (id: string) => Promise<void>;
}

export function TranslationHistory({ translations, onDelete }: TranslationHistoryProps) {
  if (translations.length === 0) {
    return <EmptyState title="No translations yet" description="Translate some text to see your history here" />;
  }

  return (
    <div className="space-y-3">
      {translations.map((t) => (
        <div key={t._id} className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{t.sourceLanguage}</span>
                <span>→</span>
                <span>{t.targetLanguage}</span>
                <span className="ml-auto">{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-700">{t.sourceText}</p>
              <p className="mt-1 truncate text-sm font-medium text-slate-900">{t.translatedText}</p>
            </div>
            <button
              onClick={() => onDelete(t._id)}
              className="ml-3 hidden rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 group-hover:block"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
