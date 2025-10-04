
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* UserProfileCard Skeleton */}
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>

             {/* MyPets Skeleton */}
            <div className="flex flex-col space-y-3">
                 <Skeleton className="h-8 w-1/4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>

        </div>
        <div className="lg:col-span-1">
             {/* FavoritePets Skeleton */}
             <div className="flex flex-col space-y-3">
                 <Skeleton className="h-8 w-1/3" />
                <div className="grid grid-cols-1 gap-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
