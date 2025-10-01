
import { PageHeader } from "@/components/page-header";
import { getPetTypes } from "@/lib/action_api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CategoryView } from "./_components/category-view";

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
      <CategoryView petTypes={petTypes} />
    </div>
  );
}
