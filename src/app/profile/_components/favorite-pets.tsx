
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FavoritePet } from "@/lib/data";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { getFavoritePets, removeFavoritePet } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function FavoritePets() {
    const [favoritePets, setFavoritePets] = useState<FavoritePet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const fetchFavoritePets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const favPets = await getFavoritePets(token);
            setFavoritePets(favPets);
        } catch (error: any) {
            if (error.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError("Could not load favorite pets.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [router, toast]);

    useEffect(() => {
        fetchFavoritePets();
    }, [fetchFavoritePets]);

    const handleRemoveFavorite = async (petId: number) => {
        setIsDeleting(petId);
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            setIsDeleting(null);
            return;
        }
        try {
            await removeFavoritePet(token, petId);
            setFavoritePets(prev => prev.filter(p => p.pet_id !== petId));
            toast({ title: "Removed from favorites." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsDeleting(null);
        }
    }

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
                        const placeholder = getPlaceholderImage('Default');
                        const imageUrl = pet.pet_image || placeholder.url;
                        const imageHint = pet.pet_image ? 'pet' : placeholder.hint;
                        return (
                            <Card key={pet.id} className="overflow-hidden group">
                                <Link href={`/pets/${pet.pet_id}`}>
                                    <div className="relative aspect-square w-full">
                                        <Image
                                            src={imageUrl}
                                            alt={pet.pet_name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            data-ai-hint={imageHint}
                                        />
                                    </div>
                                </Link>
                                <CardHeader className="p-3 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-bold">
                                        <Link href={`/pets/${pet.pet_id}`} className="hover:underline">
                                            {pet.pet_name}
                                        </Link>
                                    </CardTitle>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting === pet.pet_id}>
                                                {isDeleting === pet.pet_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will remove {pet.pet_name} from your favorites.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleRemoveFavorite(pet.pet_id)}>
                                                    Remove
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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
