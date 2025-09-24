import { pets } from "@/lib/data";
import { notFound } from "next/navigation";
import { PetImageCarousel } from "./_components/pet-image-carousel";
import { PetDetails } from "./_components/pet-details";

export default function PetProfilePage({ params }: { params: { id: string } }) {
  const pet = pets.find((p) => p.id === params.id);

  if (!pet) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <PetImageCarousel pet={pet} />
        <PetDetails pet={pet} />
      </div>
    </div>
  );
}
