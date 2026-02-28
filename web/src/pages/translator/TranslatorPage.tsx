import { useTranslations } from '../../hooks/useTranslations';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { TranslationForm } from './TranslationForm';
import { TranslationHistory } from './TranslationHistory';

export function TranslatorPage() {
  const { translations, loading, translating, error, translate, remove } = useTranslations();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Translator</h2>
        <p className="text-sm text-slate-500">Translate text between languages using AI</p>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <TranslationForm translating={translating} onTranslate={translate} />

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Translation History</h3>
        <TranslationHistory translations={translations} onDelete={remove} />
      </div>
    </div>
  );
}
