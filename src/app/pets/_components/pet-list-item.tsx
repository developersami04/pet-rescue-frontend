
'use client';

import { Card } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Cake, PersonStanding, View } from "lucide-react";
import Link from "next/link";
import { PetTypeIcon } from "@/components/pet-icons";
import { getPlaceholderImage } from "@/lib/placeholder-images";

type PetListItemProps = {
    pet: Pet;
}

export function PetListItem({ pet }: PetListItemProps) {
    const placeholder = getPlaceholderImage(pet.type_name);
    const imageUrl = pet.pet_image || placeholder.url;
    const imageHint = pet.pet_image ? (pet.breed ?? pet.type_name) : placeholder.hint;
    const petStatus = pet.pet_report?.pet_status;
    const isResolved = pet.pet_report?.is_resolved;

    const getStatusInfo = (status: string | undefined | null) => {
        if (!status || isResolved) return null;
        switch (status) {
        case 'lost':
            return { text: 'Lost', className: 'bg-destructive/90 text-destructive-foreground' };
        case 'found':
            return { text: 'Found', className: 'bg-blue-500 text-white' };
        case 'adopt':
            return { text: 'Adoptable', className: 'bg-green-500 text-white' };
        default:
            return null;
        }
    };
    const statusInfo = getStatusInfo(petStatus);


    return (
        <Card className="p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={imageHint}
                />
                 <div className="absolute top-1 left-1 bg-background/80 p-0.5 rounded-full backdrop-blur-sm">
                    <PetTypeIcon typeName={pet.type_name} className="h-4 w-4 text-foreground/80" />
                </div>
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                 <div className="sm:col-span-1">
                    <Link href={`/pets/${pet.id}`} className="hover:underline">
                        <h3 className="text-lg font-bold">{pet.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <PetTypeIcon typeName={pet.type_name} className="h-4 w-4" />
                        {pet.breed || pet.type_name}
                    </p>
                </div>
                 <div className="sm:col-span-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <PersonStanding className="h-4 w-4" />
                        <span>{pet.gender}</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                        <Cake className="h-4 w-4" />
                        <span>{pet.age ? `${pet.age} year(s) old` : 'Age unknown'}</span>
                    </div>
                     {statusInfo && (
                        <Badge className={cn("capitalize", statusInfo.className)}>
                            {statusInfo.text}
                        </Badge>
                    )}
                 </div>
                 <div className="flex justify-end sm:col-span-1">
                     <Button asChild>
                        <Link href={`/pets/${pet.id}`}>
                            <View className="mr-2 h-4 w-4" /> View Profile
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    )
}
