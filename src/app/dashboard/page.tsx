
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { DashboardClient } from "./_components/dashboard-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";


function DashboardPageSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <PageHeader
                title="Welcome to Petopia"
                description="Your dashboard for finding a new companion."
                className="pb-0"
                />
                <Skeleton className="h-10 w-44" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
            <Skeleton className="h-px w-full my-8" />
            <Skeleton className="h-12 w-full" />
            <div className="mt-6">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <PageHeader
                title="Welcome to Petopia"
                description="Your dashboard for finding a new companion."
                className="pb-0"
                />
                <Button asChild className="w-full sm:w-auto">
                <Link href="/submit-request">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Pet Request Form
                </Link>
                </Button>
            </div>
            
            <DashboardClient />
        </div>
    )
}
