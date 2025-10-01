
'use client';

import { Card } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BadgeCheck, Clock, Pen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MyPetListItemProps = {
    pet: Pet;
}

export function MyPetListItem({ pet }: MyPetListItemProps) {
    const imageUrl = pet.pet_image ?? `https://picsum.photos/seed/${pet.id}/100/100`;
    const isResolved = pet.pet_report?.is_resolved ?? false;

    return (
        <Card className="p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={pet.breed ?? pet.type_name}
                />
                 <div className="absolute top-1 left-1 bg-background/80 p-0.5 rounded-full backdrop-blur-sm">
                    {pet.is_verified ? (
                        <BadgeCheck className="h-4 w-4 text-primary" />
                    ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                    )}
                </div>
            </div>
            <div className="flex-grow grid grid-cols-5 items-center gap-4">
                <div className="col-span-2">
                    <h3 className="text-lg font-bold">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">{pet.breed || 'Unknown Breed'}</p>
                </div>
                <div>
                     {pet.pet_status && !isResolved && (
                        <Badge 
                            className={cn("capitalize", 
                                pet.pet_status === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 'bg-blue-500 text-white'
                            )}
                            >
                                {pet.pet_status}
                        </Badge>
                    )}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{pet.type_name}</p>
                </div>
                <div className="flex justify-end">
                     <Button asChild variant="secondary">
                        <Link href={`/pets/${pet.id}`}>
                            <Pen className="mr-2 h-4 w-4" /> View Details
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    )
}
