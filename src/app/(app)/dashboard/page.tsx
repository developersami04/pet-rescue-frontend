import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { pets, organizations } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PawPrint, Home, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const featuredPet = pets[0];
  const featuredPetImage = PlaceHolderImages.find(p => p.id === featuredPet.imageIds[0]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Welcome to Pet-Pal"
        description="Your dashboard for finding a new companion."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">
              ready for their forever homes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rescue Organizations
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              partnered with us to save lives
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Happy Adoptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">
              pets have found loving families
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Featured Pet</h2>
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            {featuredPetImage && (
              <div className="relative h-64 md:h-full">
                <Image
                  src={featuredPetImage.imageUrl}
                  alt={featuredPet.name}
                  fill
                  className="object-cover"
                  data-ai-hint={featuredPetImage.imageHint}
                />
              </div>
            )}
            <div>
              <CardHeader>
                <CardTitle className="text-2xl font-headline">{featuredPet.name}</CardTitle>
                <CardDescription>{featuredPet.breed} &bull; {featuredPet.age} years old</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{featuredPet.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/pets/${featuredPet.id}`}>Meet {featuredPet.name}</Link>
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
