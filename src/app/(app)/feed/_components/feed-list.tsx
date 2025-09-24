'use client';

import { FeedItem } from "./feed-item";
import { pets, organizations } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { PawPrint, Heart, UserPlus } from "lucide-react";
import { useMemo } from "react";

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

    const feedEvents: FeedEvent[] = useMemo(() => {
        const events: FeedEvent[] = [];

        // New Pets
        pets.slice(0, 3).forEach((pet, index) => {
            const petImage = PlaceHolderImages.find(p => p.id === pet.imageIds[0]);
            events.push({
                id: `new-${pet.id}`,
                type: 'new-pet',
                timestamp: new Date(Date.now() - index * 3 * 3600 * 1000), // hours ago
                title: `${pet.name} is looking for a home!`,
                description: `A ${pet.breed} is now available for adoption. Could you be the one?`,
                imageUrl: petImage?.imageUrl,
                imageHint: petImage?.imageHint,
                icon: PawPrint,
                petId: pet.id,
            });
        });

        // Recent Adoptions (mock)
        const adoptedPet = pets[4];
        const adoptedPetImage = PlaceHolderImages.find(p => p.id === adoptedPet.imageIds[0]);
        events.push({
            id: 'adopted-1',
            type: 'adoption',
            timestamp: new Date(Date.now() - 8 * 3600 * 1000),
            title: `${adoptedPet.name} has been adopted!`,
            description: 'Milo found his forever home. Congratulations to the new family!',
            imageUrl: adoptedPetImage?.imageUrl,
            imageHint: adoptedPetImage?.imageHint,
            icon: Heart,
            petId: adoptedPet.id
        });
        
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

    }, []);

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
