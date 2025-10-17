
import { Suspense } from "react";
import Loading from "./loading";
import { AdoptionRequestsClient } from "./_components/adoption-requests-client";

export default function AdminAdoptionRequestsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Suspense fallback={<Loading />}>
        <AdoptionRequestsClient />
      </Suspense>
    </div>
  );
}
