
import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { ManagePetsClient } from "./_components/manage-pets-client";
import Loading from "./loading";

export default function ManagePetsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Manage All Pets"
        description="View and manage all pets registered in the system."
      />
      <Suspense fallback={<Loading />}>
        <ManagePetsClient />
      </Suspense>
    </div>
  );
}
