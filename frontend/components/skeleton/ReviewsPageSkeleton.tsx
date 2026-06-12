function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

function ReviewCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl px-6 py-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-28 h-3.5" />
            <Skeleton className="w-16 h-2.5" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-sm" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-3/4 h-3" />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Skeleton className="w-14 h-2.5" />
        <Skeleton className="w-1 h-1 rounded-full" />
        <Skeleton className="w-16 h-2.5" />
      </div>
    </div>
  );
}

export default function ReviewsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-48 h-3.5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="w-12 h-7 rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pb-5 border-b border-border mb-6">
          <Skeleton className="w-28 h-3" />
          <Skeleton className="w-36 h-3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}