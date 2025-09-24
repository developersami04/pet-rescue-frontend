import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Pet } from "@/lib/data";

type PetImageCarouselProps = {
  pet: Pet;
};

export function PetImageCarousel({ pet }: PetImageCarouselProps) {
  const petImages = pet.imageIds
    .map((id) => PlaceHolderImages.find((img) => img.id === id))
    .filter(Boolean);

  return (
    <div className="grid gap-4">
      <Carousel className="w-full">
        <CarouselContent>
          {petImages.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={`${pet.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {petImages.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </div>
  );
}
