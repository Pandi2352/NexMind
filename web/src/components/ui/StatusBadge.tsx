const styles = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-slate-100 text-slate-600',
  fallback: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
} as const;

interface StatusBadgeProps {
  status: keyof typeof styles;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {label ?? status}
    </span>
  );
}
