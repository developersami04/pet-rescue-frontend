
import { PageHeader } from "@/components/page-header";
import { AdminReportsClient } from "./_components/admin-reports-client";
import { Suspense } from "react";
import Loading from "./loading";

export default function ApproveReportsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Approve Reports"
        description="Review and approve pet reports from users."
      />
      <Suspense fallback={<Loading />}>
        <AdminReportsClient />
      </Suspense>
    </div>
  );
}
