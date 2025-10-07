
import { AdminReportsClient } from "./_components/admin-reports-client";
import { Suspense } from "react";
import Loading from "./loading";

export default function ApproveReportsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Suspense fallback={<Loading />}>
        <AdminReportsClient />
      </Suspense>
    </div>
  );
}
