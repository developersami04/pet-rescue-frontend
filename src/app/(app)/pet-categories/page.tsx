
import { PageHeader } from "@/components/page-header";
import { getPetTypes } from "@/lib/action_api";
import { CategoryCard } from "./_components/category-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PetType = {
  id: number;
  name: string;
};

export default async function PetCategoriesPage() {
  const petTypes: PetType[] | null = await getPetTypes();

  if (!petTypes || petTypes.length === 0) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
             <PageHeader
                title="Pet Categories"
                description="Browse pets by their category."
            />
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Could not fetch pet categories. Please try again later.</AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Pet Categories"
        description="Browse pets by their category."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {petTypes.map((petType) => (
          <CategoryCard key={petType.id} petType={petType} />
        ))}
      </div>
    </div>
  );
}

    