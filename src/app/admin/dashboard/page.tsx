
import { PageHeader } from "@/components/page-header";
import { AdminDashboardStats } from "./_components/admin-dashboard-stats";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-28" />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Welcome to the admin control center."
      />
      <Suspense fallback={<StatsSkeleton />}>
        <AdminDashboardStats />
      </Suspense>
    </div>
  );
}
