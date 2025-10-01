
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BadgeCheck, Clock, Pen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyPets } from "@/lib/action_api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


function MyPetsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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

export function MyPetsSection() {
    const [myPets, setMyPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();


    useEffect(() => {
        async function fetchMyPets() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userPets = await getMyPets(token);
                setMyPets(userPets);
            } catch (error: any) {
                if (error.message.includes('Session expired')) {
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
                    console.error("Failed to fetch user's pets:", error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchMyPets();
    }, [router, toast]);

    if (isLoading) {
        return <MyPetsSkeleton />;
    }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myPets.map(pet => {
                const imageUrl = pet.pet_image ?? `https://picsum.photos/seed/${pet.id}/300/300`;
                const isResolved = pet.pet_report?.is_resolved ?? false; // Fallback for my-pets where pet_report might not exist
                return (
                    <Card key={pet.id} className="overflow-hidden flex flex-col">
                        <div className="relative aspect-square w-full">
                            <Image
                                src={imageUrl}
                                alt={pet.name}
                                fill
                                className="object-cover"
                                data-ai-hint={pet.breed ?? pet.type_name}
                            />
                            <div className="absolute top-2 left-2 bg-background/80 p-1 rounded-full backdrop-blur-sm">
                                {pet.is_verified ? (
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                ) : (
                                    <Clock className="h-5 w-5 text-amber-500" />
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
                        <CardHeader className="p-4 flex-grow">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                {pet.name}
                            </CardTitle>
                             <p className="text-sm text-muted-foreground pt-1">{pet.breed}</p>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0">
                            <Button asChild variant="secondary" className="w-full">
                                <Link href={`/pets/${pet.id}`}>
                                    <Pen className="mr-2 h-4 w-4" /> View Details
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    );
}
