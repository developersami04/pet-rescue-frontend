import { pets } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PetProfilePage({ params }: { params: { id: string } }) {
  const pet = pets.find((p) => p.id === params.id);

  if (!pet) {
    notFound();
  }

  const petImages = pet.imageIds
    .map((id) => PlaceHolderImages.find((img) => img.id === id))
    .filter(Boolean);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
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
        <div className="grid gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">{pet.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{pet.type}</Badge>
              <Badge variant="secondary">{pet.breed}</Badge>
              <Badge variant="secondary">{pet.age} {pet.age > 1 ? "years" : "year"}</Badge>
              <Badge variant="secondary">{pet.size}</Badge>
              <Badge variant="secondary">{pet.gender}</Badge>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{pet.description}</p>
            </CardContent>
          </Card>
          <div className="grid gap-2">
            <h3 className="font-semibold">Additional Details</h3>
            <Separator />
            <div className="grid grid-cols-2 text-sm">
                <p className="text-muted-foreground">ID:</p><p>{pet.id}</p>
                <p className="text-muted-foreground">Status:</p><p>Available for Adoption</p>
                <p className="text-muted-foreground">Location:</p><p>Shelter Name</p>
            </div>
          </div>
          <Button size="lg" asChild className="w-full">
            <Link href={`/pets/${pet.id}/adopt`}>Adopt {pet.name}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
