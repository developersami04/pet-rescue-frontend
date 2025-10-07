
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-56 w-full rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    )
}

export default function Loading() {
  return (
    <>
        <div className="mb-8">
            <Skeleton className="h-10 w-full lg:w-1/3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    </>
  );
}
