import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from 'lucide-react';

export default function LoadingPotteryDetail() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-10 w-40 mb-8" /> {/* Back button placeholder */}

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" /> {/* Title */}
          {/* Removed Badge Skeleton */}

          <div className="space-y-2"> {/* Description */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
            {[...Array(3)].map((_, i) => ( // Adjusted count to 3 (Materials, Category, Dimensions/Date)
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-5 w-32" /> {/* Value */}
              </div>
            ))}
             {/* Removed Price Skeleton */}
          </div>

          {/* Removed Button Skeleton */}
        </div>
      </div>
    </div>
  );
}
