
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pets } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Pen, Trash2 } from "lucide-react";

export function MyPets() {
    // This will be filtered by the current user in a real application
    const myPets = pets.slice(1, 4);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Pets</CardTitle>
                <CardDescription>Pets you have listed for adoption.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myPets.map(pet => {
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
                            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm">
                                    <Pen className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
                 {myPets.length === 0 && (
                    <p className="text-muted-foreground col-span-full">You haven't added any pets yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
