import { usePromptOptimizer } from '../../hooks/usePromptOptimizer';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { PromptOptimizerForm } from './PromptOptimizerForm';
import { PromptOptimizerHistory } from './PromptOptimizerHistory';

export function PromptOptimizerPage() {
  const { optimizations, loading, optimizing, error, optimize, remove } = usePromptOptimizer();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Prompt Optimizer</h2>
        <p className="text-sm text-slate-500">Transform vague prompts into clear, effective instructions using AI</p>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <PromptOptimizerForm optimizing={optimizing} onOptimize={optimize} />

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Optimization History</h3>
        <PromptOptimizerHistory optimizations={optimizations} onDelete={remove} />
      </div>
    </div>
  );
}
