
import { PageHeader } from "@/components/page-header";
import { CategoryPetList } from "./_components/category-pet-list";
import { Suspense } from "react";
import Loading from "./loading";

type CategoryPageProps = {
    params: {
        categoryName: string;
    }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.categoryName);
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title={`Category: ${categoryName}`}
        description={`Browse all pets in the "${categoryName}" category.`}
      />
      <Suspense fallback={<Loading />}>
        <CategoryPetList categoryName={categoryName} />
      </Suspense>
    </div>
  );
}
