export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton skeleton-shimmer ${className}`} />;
}

export function HeroSkeleton() {
  return (
    <div className="relative mt-2 min-h-[520px] overflow-hidden rounded-5xl border border-white/[0.06] bg-canvas-surface sm:min-h-[580px]">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="relative flex min-h-[520px] max-w-2xl flex-col justify-end p-8 sm:min-h-[580px] sm:p-14">
        <Skeleton className="mb-4 h-3 w-32" />
        <Skeleton className="mb-2 h-14 w-3/4 max-w-md" />
        <Skeleton className="mb-2 h-14 w-1/2 max-w-sm" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="mt-6 h-16 w-full max-w-xl" />
        <div className="mt-8 flex gap-4">
          <Skeleton className="h-12 w-36 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function PosterGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function RailSkeleton() {
  return (
    <section className="mt-14">
      <Skeleton className="mb-2 h-3 w-28" />
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[240px] w-[154px] flex-none sm:w-[178px]" />
        ))}
      </div>
    </section>
  );
}

export function PageLoadingShell({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas text-warm-300">
      <div className="relative mb-6 h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold" />
      </div>
      <p className="animate-pulse-soft text-sm tracking-wide">{message}</p>
    </div>
  );
}
