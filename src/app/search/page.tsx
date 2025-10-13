
import { PageHeader } from "@/components/page-header";
import { SearchResults } from "./_components/search-results";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SearchPageSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                     <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-56 w-full rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default function SearchPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
