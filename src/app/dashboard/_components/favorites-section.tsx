
'use client';

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FavoritePet } from "@/lib/data";
import { Heart, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { removeFavoritePet } from "@/lib/actions";

type FavoritesSectionProps = {
    favoritePets: FavoritePet[];
    onUpdate: () => void;
}

export function FavoritesSection({ favoritePets, onUpdate }: FavoritesSectionProps) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const { toast } = useToast();

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
            toast({ title: "Removed from favorites." });
            onUpdate();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsDeleting(null);
        }
    }


    if (favoritePets.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
                <Heart className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No Favorite Pets Yet</h3>
                <p className="mt-2">Browse pets and click the heart icon to save them here.</p>
                 <Button asChild variant="link" className="mt-2">
                    <Link href="/pets">Browse Pets</Link>
                </Button>
            </Card>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoritePets.map(pet => {
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
            })}
        </div>
    );
}
