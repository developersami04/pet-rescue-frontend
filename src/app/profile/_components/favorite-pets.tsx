
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { getAllPets } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FavoritePets() {
    const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const fetchPets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsLoading(false);
            // It's okay to not have a token, just don't show favorites
            return;
        }
        try {
            const allPets = await getAllPets(token);
            // Mocking favorites for now, e.g., first 3 pets
            setFavoritePets(allPets.slice(0, 3));
        } catch (error: any) {
            if (error.message.includes('Session expired')) {
                toast({
                    variant: 'destructive',
                    title: 'Session Expired',
                    description: 'Please log in again to continue.',
                });
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.dispatchEvent(new Event('storage'));
                router.push('/login');
            } else {
                setError("Could not load favorite pets.");
                console.error("Failed to fetch favorite pets:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [router, toast]);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Favorite Pets</CardTitle>
                <CardDescription>Pets you've saved to your favorites.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                             <Skeleton className="aspect-square w-full" />
                             <Skeleton className="h-5 w-3/4" />
                        </div>
                    ))
                ) : error ? (
                    <div className="col-span-full">
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </div>
                ) : favoritePets.length > 0 ? (
                    favoritePets.map(pet => {
                        const imageUrl = pet.pet_image || `https://picsum.photos/seed/${pet.id}/300/300`;
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
