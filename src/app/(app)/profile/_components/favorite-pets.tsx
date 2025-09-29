
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllPets } from "@/lib/action_api";

export function FavoritePets() {
    const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPets() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const allPets = await getAllPets(token);
                // Mocking favorites for now, e.g., first 3 pets
                setFavoritePets(allPets.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch favorite pets:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPets();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Favorite Pets</CardTitle>
                <CardDescription>Pets you've saved to your favorites.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <p>Loading favorites...</p>
                ) : favoritePets.length > 0 ? (
                    favoritePets.map(pet => {
                        const imageUrl = pet.image ?? `https://picsum.photos/seed/${pet.id}/300/300`;
                        return (
                            <Card key={pet.id} className="overflow-hidden">
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={imageUrl}
                                        alt={pet.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={pet.breed ?? pet.type_name}
                                    />
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
                    })
                ) : (
                    <p className="text-muted-foreground col-span-full text-center py-8">You have no favorite pets yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
