
'use client';

import { PetCard } from "@/app/(app)/pets/_components/pet-card";
import { Pet } from "@/lib/data";
import { PawPrint } from "lucide-react";

type ReportPetListProps = {
    pets: Pet[];
    status: 'lost' | 'found' | 'adopt';
};

export function ReportPetList({ pets, status }: ReportPetListProps) {
    if (pets.length === 0) {
        return (
            <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg">
                 <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No {status} pets found</h3>
                <p className="text-muted-foreground mt-2">
                    There are currently no pets reported with this status.
                </p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
            ))}
        </div>
    )
}
