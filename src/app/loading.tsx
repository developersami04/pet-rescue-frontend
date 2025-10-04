
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       <div className="pb-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
       <div className="mt-8">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
