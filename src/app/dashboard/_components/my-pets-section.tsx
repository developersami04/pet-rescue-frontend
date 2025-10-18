
'use client';

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BadgeCheck, Clock, LayoutGrid, List, Pen } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MyPetListItem } from "./my-pet-list-item";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { PetTypeIcon } from "@/components/pet-icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type MyPetsSectionProps = {
    myPets: Pet[];
}

export function MyPetsSection({ myPets }: MyPetsSectionProps) {

    if (myPets.length === 0) {
        return (
             <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">You haven't added any pets yet</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                    List a pet for adoption and find them a loving home.
                </p>
                <Button asChild>
                    <Link href="/submit-request">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add a Pet
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-4 p-4">
                {myPets.map(pet => {
                    const placeholder = getPlaceholderImage(pet.type_name);
                    const imageUrl = pet.pet_image || placeholder.url;
                    const imageHint = pet.pet_image ? pet.type_name : placeholder.hint;
                    const isResolved = pet.pet_report?.is_resolved ?? false;
                    return (
                        <Card key={pet.id} className="overflow-hidden flex flex-col w-64">
                            <Link href={`/pets/${pet.id}`} className="group">
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={imageUrl}
                                        alt={pet.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        data-ai-hint={imageHint}
                                    />
                                    <div className="absolute top-2 left-2 bg-background/80 p-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                                        <PetTypeIcon typeName={pet.type_name} className="h-4 w-4 text-foreground/80" />
                                        {pet.is_verified ? (
                                            <BadgeCheck className="h-4 w-4 text-primary" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-amber-500" />
                                        )}
                                    </div>
                                    {pet.pet_status && !isResolved && (
                                        <Badge 
                                            className={cn("absolute bottom-2 right-2 capitalize", 
                                                pet.pet_status === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 'bg-blue-500 text-white'
                                            )}
                                            >
                                                {pet.pet_status}
                                        </Badge>
                                    )}
                                </div>
                            </Link>
                            <CardHeader className="p-4 flex-grow">
                                <CardTitle className="text-lg font-bold">
                                     <Link href={`/pets/${pet.id}`} className="hover:underline">
                                        {pet.name}
                                    </Link>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground pt-1">{pet.breed}</p>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0">
                                <Button asChild variant="secondary" className="w-full">
                                    <Link href={`/submit-request/${pet.id}`}>
                                        <Pen className="mr-2 h-4 w-4" /> Edit Details
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
