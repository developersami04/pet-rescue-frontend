
"use client";
import { useEffect, useState } from "react";
import type { Pet } from "@/lib/data";
import { getAllPets } from "@/lib/action_api";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function PetCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardHeader className="p-3">
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
    );
}

export function IndiaMap() {
    const [selectedState, setSelectedState] = useState<string | null>("Maharashtra");
    const [allPets, setAllPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();


    useEffect(() => {
        async function fetchPets() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Authentication required to view pets.");
                setIsLoading(false);
                return;
            }
            try {
                const pets = await getAllPets(token);
                setAllPets(pets);
            } catch (err: any) {
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
                    setError(err.message || "Failed to fetch pets.");
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchPets();
    }, [router, toast]);

    const petsInState = allPets.filter(pet => pet.state === selectedState);

    return (
        <Card className="grid md:grid-cols-3 h-[75vh] overflow-hidden">
            <ScrollArea className="md:col-span-1 h-full border-r">
                <div className="p-2">
                    <p className="p-2 text-sm font-semibold text-muted-foreground">Select a State</p>
                    {indianStates.map(state => (
                        <Button
                            key={state}
                            variant={selectedState === state ? "secondary" : "ghost"}
                            className="w-full justify-start mb-1"
                            onClick={() => setSelectedState(state)}
                        >
                            {state}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
            <div className="md:col-span-2 h-full flex flex-col">
                <CardHeader>
                    <CardTitle>
                        {selectedState ? `Available Pets in ${selectedState}` : "Select a State"}
                    </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow">
                    <CardContent>
                        {isLoading ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => <PetCardSkeleton key={i} />)}
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-center p-8">
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </div>
                        ) : selectedState && petsInState.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {petsInState.map(pet => {
                                    const imageUrl = pet.pet_image ?? `https://picsum.photos/seed/${pet.id}/400/300`;
                                    return (
                                        <Card key={pet.id} className="overflow-hidden">
                                            <div className="relative h-40 w-full">
                                                <Image
                                                    src={imageUrl}
                                                    alt={pet.name}
                                                    fill
                                                    className="object-cover"
                                                    data-ai-hint={pet.breed ?? pet.type_name}
                                                />
                                            </div>
                                            <CardHeader className="p-3">
                                                <CardTitle className="text-base">{pet.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <Button asChild className="w-full" size="sm">
                                                    <Link href={`/pets/${pet.id}`}>View Profile</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8">
                                <p>{selectedState ? "No pets found in this state." : "Please select a state to see available pets."}</p>
                            </div>
                        )}
                    </CardContent>
                </ScrollArea>
            </div>
        </Card>
    );
}
