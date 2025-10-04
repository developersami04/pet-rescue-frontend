
import { PageHeader } from "@/components/page-header";
import { ReportsClient } from "./_components/reports-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ReportsPageSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
             <PageHeader
                title="Pet Reports"
                description="Browse reports for lost, found, and adoptable pets."
            />
            <div className="space-y-8">
                <Skeleton className="h-12 w-full" />
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
        </div>
    )
}

export default function ReportsPage() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PageHeader
                title="Pet Reports"
                description="Browse reports for lost, found, and adoptable pets."
            />
            <Suspense fallback={<ReportsPageSkeleton />}>
                <ReportsClient />
            </Suspense>
        </div>
    )
}
