import { SkeletonCard } from '@/components/pottery/SkeletonCard';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="h-10 bg-muted rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-muted rounded w-3/4 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
