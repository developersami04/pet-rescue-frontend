
import { Suspense } from "react";
import { ManagePetsClient } from "./_components/manage-pets-client";
import Loading from "./loading";

export default function ManagePetsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Suspense fallback={<Loading />}>
        <ManagePetsClient />
      </Suspense>
    </div>
  );
}
