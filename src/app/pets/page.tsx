
import { PageHeader } from "@/components/page-header";
import { PetFilters } from "./_components/pet-filters";
import { PetList } from "./_components/pet-list";

export default function PetsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Find a New Friend"
        description="Browse our available pets and find your perfect match."
      />
      <PetList />
    </div>
  );
}
