
import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import { ManageUsersClient } from "./_components/manage-users-client";
import Loading from "./loading";

export default function ManageUsersPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Manage Users"
        description="View and manage all registered users in the system."
      />
      <Suspense fallback={<Loading />}>
        <ManageUsersClient />
      </Suspense>
    </div>
  );
}
