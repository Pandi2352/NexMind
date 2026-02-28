export function LoadingSpinner() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center">
      {/* Orbital loader */}
      <div className="relative h-20 w-20">
        {/* Outer ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-blue-500 [animation-duration:1.2s]" />
        {/* Middle ring - reverse spin */}
        <div className="absolute inset-2 animate-spin rounded-full border-[3px] border-transparent border-t-indigo-500 [animation-direction:reverse] [animation-duration:0.9s]" />
        {/* Inner ring */}
        <div className="absolute inset-4 animate-spin rounded-full border-[3px] border-transparent border-t-violet-500 [animation-duration:0.6s]" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30" />
        </div>
      </div>

      {/* Loading text with dots animation */}
      <div className="mt-6 flex items-center gap-1">
        <span className="text-sm font-medium text-slate-400">Loading</span>
        <span className="flex gap-0.5">
          <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:0ms]" />
          <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-indigo-500 [animation-delay:150ms]" />
          <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-violet-500 [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}
