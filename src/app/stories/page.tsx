
import { PageHeader } from "@/components/page-header";
import { Suspense } from "react";
import Loading from "./loading";
import { StoriesClient } from "./_components/stories-client";

export default function StoriesPage() {
  return (
    <Suspense fallback={<Loading />}>
        <StoriesClient />
    </Suspense>
  );
}
