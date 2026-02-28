import { useHealth } from '../../hooks/useHealth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { HealthForm } from './HealthForm';
import { HealthHistory } from './HealthHistory';

export function HealthPage() {
  const { consultations, loading, consulting, error, consult, remove } = useHealth();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Health Advisor</h2>
        <p className="text-sm text-slate-500">Share your symptoms and get AI-powered health guidance including medications, diet plans, and lifestyle tips</p>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <HealthForm consulting={consulting} onConsult={consult} />

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Consultation History</h3>
        <HealthHistory consultations={consultations} onDelete={remove} />
      </div>
    </div>
  );
}
