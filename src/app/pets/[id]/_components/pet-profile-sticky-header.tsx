
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/data";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addFavoritePet, removeFavoritePet } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

type PetProfileStickyHeaderProps = {
    pet: Pet;
    isFavorited: boolean;
    likeCount: number;
    onFavoriteToggle: (favorited: boolean) => void;
}

export function PetProfileStickyHeader({ pet, isFavorited, likeCount, onFavoriteToggle }: PetProfileStickyHeaderProps) {
    const { toast } = useToast();
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const [isHidden, setIsHidden] = useState(true);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 400) {
            setIsHidden(false);
        } else {
            setIsHidden(true);
        }
    });

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
                onFavoriteToggle(false);
            } else {
                await addFavoritePet(token, pet.id);
                toast({ title: 'Added to Favorites' });
                onFavoriteToggle(true);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsFavoriteLoading(false);
        }
    }
    
    return (
        <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: isHidden ? "-100%" : "0%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky top-16 z-40 bg-background/80 backdrop-blur-sm border-b"
        >
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold">{pet.name}</h2>
                    <p className="text-sm text-muted-foreground">Reported by: {pet.pet_report?.reporter_name || 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1.5">
                        <span>{likeCount}</span>
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
        </motion.div>
    );
}
