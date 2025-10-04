
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="pb-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}
