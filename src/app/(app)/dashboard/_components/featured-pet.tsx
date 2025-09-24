import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { pets } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturedPet() {
    const featuredPet = pets[0];
    const featuredPetImage = PlaceHolderImages.find(p => p.id === featuredPet.imageIds[0]);

    return (
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
    );
}
