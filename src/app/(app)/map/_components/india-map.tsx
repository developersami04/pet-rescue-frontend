
"use client";
import { useState } from "react";
import { pets, organizations } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export function IndiaMap() {
    const [selectedState, setSelectedState] = useState<string | null>("Maharashtra");

    const petsInState = pets.filter(pet => {
        const organization = organizations.find(org => org.id === pet.organizationId);
        return organization?.location.state === selectedState;
    });

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
                        {selectedState && petsInState.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {petsInState.map(pet => {
                                    const petImage = PlaceHolderImages.find(p => p.id === pet.imageIds[0]);
                                    return (
                                        <Card key={pet.id} className="overflow-hidden">
                                            <div className="relative h-40 w-full">
                                                {petImage && (
                                                    <Image
                                                        src={petImage.imageUrl}
                                                        alt={pet.name}
                                                        fill
                                                        className="object-cover"
                                                        data-ai-hint={petImage.imageHint}
                                                    />
                                                )}
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
