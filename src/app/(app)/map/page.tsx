import { PageHeader } from "@/components/page-header";
import { IndiaMap } from "./_components/india-map";

export default function MapPage() {

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Pets and Rescues Near You"
        description="Explore available pets from rescue organizations on the map."
      />
      <IndiaMap />
    </div>
  );
}
