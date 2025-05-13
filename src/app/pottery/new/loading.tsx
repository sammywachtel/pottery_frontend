import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function LoadingAddNewPottery() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Skeleton className="h-10 w-1/3 mb-6" /> {/* Title placeholder */}
      
      <div className="space-y-6">
        {/* Form Field Skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input/Textarea/Select */}
          </div>
        ))}

        {/* Image Upload Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Label */}
          <Skeleton className="h-24 w-full rounded-md border-2 border-dashed border-muted" /> {/* Dropzone area */}
        </div>
        
        {/* Image Previews Skeleton (optional, if you plan to show previews) */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>

        {/* Submit Button Skeleton */}
        <Skeleton className="h-12 w-full sm:w-1/3" />
      </div>
    </div>
  );
}
