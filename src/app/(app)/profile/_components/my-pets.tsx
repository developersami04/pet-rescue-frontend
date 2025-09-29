
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Pen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllPets } from "@/lib/action_api";
import { useUserDetails } from "@/hooks/use-user-details";

export function MyPets() {
    const { user } = useUserDetails();
    const [myPets, setMyPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMyPets() {
            if (!user) return;
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const allPets = await getAllPets(token);
                const userPets = allPets.filter((pet: Pet) => pet.created_by === user.id);
                setMyPets(userPets);
            } catch (error) {
                console.error("Failed to fetch user's pets:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMyPets();
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Pets</CardTitle>
                <CardDescription>Pets you have listed for adoption.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <p>Loading your pets...</p>
                ) : myPets.length > 0 ? (
                    myPets.map(pet => {
                        const imageUrl = pet.image ?? `https://picsum.photos/seed/${pet.id}/300/300`;
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
                                <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                                    <Button variant="outline" size="sm">
                                        <Pen className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })
                ) : (
                    <p className="text-muted-foreground col-span-full text-center py-8">You haven't added any pets yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
