
'use client';

import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Expand, Heart, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { addFavoritePet, removeFavoritePet } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type PetProfileHeaderProps = {
    pet: Pet;
    isFavorited: boolean;
    onUpdate: () => void;
}

export function PetProfileHeader({ pet, isFavorited, onUpdate }: PetProfileHeaderProps) {
    const { toast } = useToast();
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const placeholder = getPlaceholderImage(pet.type_name);
    const imageUrl = pet.pet_image || placeholder.url;
    const imageHint = pet.pet_image ? pet.type_name : placeholder.hint;
    const petStatus = pet.pet_report?.pet_status;
    const isResolved = pet.pet_report?.is_resolved;
    const reportStatus = pet.pet_report?.report_status;

    const getReportStatusVariant = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'pending':
            default:
                return 'secondary';
        }
    };

    const getStatusInfo = (status: 'lost' | 'found' | 'adopt' | undefined) => {
        if (!status) return null;
        switch (status) {
            case 'lost':
                return { label: 'Lost', className: 'bg-destructive/90 text-destructive-foreground' };
            case 'found':
                return { label: 'Found(Available For Adoption)', className: 'bg-blue-500 text-white' };
            case 'adopt':
                return { label: 'Ready for Adoption', className: 'bg-green-500 text-white' };
            default:
                return null;
        }
    };

    const statusInfo = getStatusInfo(petStatus);


    const handleFavoriteToggle = async () => {
        setIsFavoriteLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
            setIsFavoriteLoading(false);
            return;
        }

        try {
            if (isFavorited) {
                await removeFavoritePet(token, pet.id);
                toast({ title: 'Removed from Favorites' });
            } else {
                await addFavoritePet(token, pet.id);
                toast({ title: 'Added to Favorites' });
            }
            onUpdate(); // Re-fetch pet details to update favorite status
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsFavoriteLoading(false);
        }
    }


    return (
       <div className="relative h-96 w-full rounded-lg overflow-hidden bg-muted group">
            <Dialog>
                 <DialogTrigger asChild>
                    <div className="absolute inset-0 cursor-pointer">
                        <Image
                            src={imageUrl}
                            alt={pet.name}
                            fill
                            className="object-cover"
                            data-ai-hint={imageHint}
                        />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary">
                                <Expand className="mr-2 h-4 w-4" />
                                View Fullscreen
                            </Button>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh] p-2">
                    <div className="relative w-full h-full">
                         <Image
                            src={imageUrl}
                            alt={pet.name}
                            fill
                            className="object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end text-white">
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold font-headline">{pet.name}</h1>
                        {statusInfo && !isResolved && (
                            <Badge
                                className={cn("text-base", statusInfo.className)}
                            >
                                {statusInfo.label}
                            </Badge>
                        )}
                    </div>
                    <p className="mt-2 text-lg max-w-2xl text-white/90">{pet.description}</p>
                </div>
                 {reportStatus && (
                    <div className="flex flex-col items-end">
                        <Badge variant={getReportStatusVariant(reportStatus)} className="capitalize">
                           Admin Status: {reportStatus}
                        </Badge>
                    </div>
                )}
            </div>
             <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-background/80 text-foreground text-sm font-medium px-3 py-1.5 backdrop-blur-sm">
                    <span>{pet.likes ?? 0}</span>
                    <Heart className="h-4 w-4 text-red-500" />
                </div>
                <Button variant="secondary" size="icon" onClick={handleFavoriteToggle} disabled={isFavoriteLoading}>
                    {isFavoriteLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
                    )}
                    <span className="sr-only">Favorite</span>
                </Button>
            </div>
       </div>
    );
}
