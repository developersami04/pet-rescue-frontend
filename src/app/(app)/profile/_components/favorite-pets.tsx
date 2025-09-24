import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pets } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function FavoritePets() {
    const favoritePets = pets.slice(0, 3);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Favorite Pets</CardTitle>
                <CardDescription>Pets you've saved to your favorites.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritePets.map(pet => {
                    const petImage = PlaceHolderImages.find(p => p.id === pet.imageIds[0]);
                    return (
                        <Card key={pet.id} className="overflow-hidden">
                            <div className="relative h-40 w-full">
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
                            <CardHeader className="p-4">
                                <CardTitle className="text-base font-bold">{pet.name}</CardTitle>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0">
                                <Button asChild className="w-full" variant="secondary" size="sm">
                                    <Link href={`/pets/${pet.id}`}>View</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    );
}
