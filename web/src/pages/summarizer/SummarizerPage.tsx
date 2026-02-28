import { useSummaries } from '../../hooks/useSummaries';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SummaryForm } from './SummaryForm';
import { SummaryHistory } from './SummaryHistory';

export function SummarizerPage() {
  const { summaries, loading, summarizing, error, summarize, remove } = useSummaries();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Summarizer</h2>
        <p className="text-sm text-slate-500">Summarize articles, documents, and text using AI</p>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <SummaryForm summarizing={summarizing} onSummarize={summarize} />

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Summary History</h3>
        <SummaryHistory summaries={summaries} onDelete={remove} />
      </div>
    </div>
  );
}
