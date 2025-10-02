
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pen } from "lucide-react";
import Link from "next/link";
import { MyPetListItem } from "../../dashboard/_components/my-pet-list-item";
import { Skeleton } from "@/components/ui/skeleton";

type MyPetsProps = {
    myPets: Pet[];
    isLoading: boolean;
}

function MyPetsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                 <CardSkeleton key={i} />
            ))}
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    )
}

export function MyPets({ myPets, isLoading }: MyPetsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Pets</CardTitle>
                <CardDescription>Pets you have listed for adoption.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <MyPetsSkeleton />
                ) : myPets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myPets.map(pet => {
                            const imageUrl = pet.pet_image ?? `https://picsum.photos/seed/${pet.id}/300/300`;
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
                                    <CardFooter className="p-4 pt-0">
                                        <Button asChild className="w-full" variant="secondary" size="sm">
                                            <Link href={`/submit-request/${pet.id}`}>
                                                <Pen className="mr-2 h-4 w-4" /> Edit
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-muted-foreground col-span-full text-center py-8">You haven't added any pets yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
