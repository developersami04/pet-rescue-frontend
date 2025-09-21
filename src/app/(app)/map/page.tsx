import { PageHeader } from "@/components/page-header";
import { organizations, pets } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple hash function to get a number from a string for positioning
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export default function MapPage() {
  const petsWithOrgData = pets.map((pet) => ({
    ...pet,
    organization: organizations.find((org) => org.id === pet.organizationId),
  }));

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Pets and Rescues Near You"
        description="Explore available pets from rescue organizations on the map."
      />
      <Card>
        <CardContent className="p-2">
          <div className="relative h-[60vh] w-full rounded-lg overflow-hidden bg-muted border">
            <Image
              src="https://picsum.photos/seed/mapbg/1600/1200"
              alt="Map background"
              fill
              className="object-cover opacity-30"
              data-ai-hint="world map"
            />
            {petsWithOrgData.map((pet, index) => {
              if (!pet.organization) return null;
              const petImage = PlaceHolderImages.find(p => p.id === pet.imageIds[0]);
              const top = (hashString(pet.id) % 85) + 5; // 5% to 90%
              const left = (hashString(pet.name + pet.id) % 90) + 5; // 5% to 95%

              return (
                <Popover key={pet.id}>
                  <PopoverTrigger asChild>
                    <button
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ top: `${top}%`, left: `${left}%` }}
                      aria-label={`Location of ${pet.name}`}
                    >
                      <MapPin className="h-8 w-8 text-primary drop-shadow-lg transition-transform hover:scale-125" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">{pet.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {pet.breed}
                        </p>
                      </div>
                      <div className="relative h-40 w-full rounded-md overflow-hidden">
                        {petImage && (
                          <Image
                            src={petImage.imageUrl}
                            alt={pet.name}
                            fill
                            className="object-cover"
                            data-ai-hint={petImage.imageHint}
                          />
                        )}
                      </div>
                      <Button asChild>
                        <Link href={`/pets/${pet.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
