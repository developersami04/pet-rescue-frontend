
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
        <PageHeader
            title="Post a Story"
            description="Share a heartwarming story about a pet."
        />
        <div className="max-w-2xl mx-auto border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-40 w-full" />
            </div>
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    </div>
  );
}
