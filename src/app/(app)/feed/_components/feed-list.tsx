
'use client';

import { FeedItem } from "./feed-item";
import { PawPrint, Heart, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Pet } from "@/lib/data";
import { getAllPets } from "@/lib/action_api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type FeedEvent = {
    id: string;
    type: 'new-pet' | 'adoption' | 'new-user';
    timestamp: Date;
    title: string;
    description: string;
    imageUrl?: string;
    imageHint?: string;
    icon: React.ElementType;
    petId?: string;
}

export function FeedList() {
    const [pets, setPets] = useState<Pet[]>([]);
    const { toast } = useToast();
    const router = useRouter();


    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            getAllPets(token)
                .then(setPets)
                .catch(err => {
                    if (err.message.includes('Session expired')) {
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
                        console.error("Failed to fetch pets for feed:", err)
                        toast({
                            variant: 'destructive',
                            title: 'Error',
                            description: 'Could not fetch pets for the feed.',
                        });
                    }
                });
        }
    }, [router, toast]);

    const feedEvents: FeedEvent[] = useMemo(() => {
        const events: FeedEvent[] = [];
        
        if (pets.length > 0) {
            // New Pets
            pets.slice(0, 3).forEach((pet, index) => {
                events.push({
                    id: `new-${pet.id}`,
                    type: 'new-pet',
                    timestamp: new Date(Date.now() - index * 3 * 3600 * 1000), // hours ago
                    title: `${pet.name} is looking for a home!`,
                    description: `A ${pet.breed} is now available for adoption. Could you be the one?`,
                    imageUrl: pet.pet_image ?? `https://picsum.photos/seed/${pet.id}/400/300`,
                    imageHint: pet.breed ?? pet.type_name,
                    icon: PawPrint,
                    petId: pet.id.toString(),
                });
            });

            // Recent Adoptions (mock from available pets)
            if (pets.length > 4) {
                const adoptedPet = pets[4];
                events.push({
                    id: 'adopted-1',
                    type: 'adoption',
                    timestamp: new Date(Date.now() - 8 * 3600 * 1000),
                    title: `${adoptedPet.name} has been adopted!`,
                    description: `${adoptedPet.name} found a forever home. Congratulations to the new family!`,
                    imageUrl: adoptedPet.pet_image ?? `https://picsum.photos/seed/${adoptedPet.id}/400/300`,
                    imageHint: adoptedPet.breed ?? adoptedPet.type_name,
                    icon: Heart,
                    petId: adoptedPet.id.toString()
                });
            }
        }
        
        // New User (mock)
        events.push({
            id: 'new-user-1',
            type: 'new-user',
            timestamp: new Date(Date.now() - 24 * 3600 * 1000),
            title: 'Welcome a new member!',
            description: 'Jane Doe just joined the Pet-Pal community. Say hello!',
            imageUrl: `https://picsum.photos/seed/jane-doe/400/400`,
            imageHint: 'profile picture',
            icon: UserPlus,
        });

        // Sort events by timestamp
        return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    }, [pets]);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
                {feedEvents.map(event => (
                    <FeedItem key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}

    