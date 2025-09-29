
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import type { Pet } from "@/lib/data";
import { PawPrint } from "lucide-react";

type PetImageCarouselProps = {
  pet: Pet;
};

export function PetImageCarousel({ pet }: PetImageCarouselProps) {
  // Since the API now provides a single image URL, we'll display that.
  // If no image is provided, we use a placeholder.
  const imageUrl = pet.image ?? `https://picsum.photos/seed/${pet.id}/600/600`;

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <Image
              src={imageUrl}
              alt={pet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={pet.breed ?? pet.type_name}
            />
            {!pet.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PawPrint className="h-20 w-20 text-white/50" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
