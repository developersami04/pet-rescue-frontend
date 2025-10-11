
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Pet Stories"
        description="Read heartwarming stories from our community."
      />
      <div className="max-w-2xl mx-auto space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
             <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
