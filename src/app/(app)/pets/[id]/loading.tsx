
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Header Skeleton */}
      <Skeleton className="h-96 w-full rounded-lg" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Details Card Skeleton */}
            <Skeleton className="h-80 w-full" />

            {/* Report Card Skeleton */}
            <Skeleton className="h-60 w-full" />
        </div>
        <div className="lg:col-span-1 space-y-8">
            {/* Medical History Skeleton */}
            <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}
