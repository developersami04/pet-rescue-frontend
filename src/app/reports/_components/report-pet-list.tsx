
'use client';

import { PetCard } from "@/app/pets/_components/pet-card";
import { Pet, PetReport } from "@/lib/data";
import { PawPrint } from "lucide-react";

type ReportPetListProps = {
    reports: PetReport[];
    status: 'lost' | 'found' | 'adopt';
};

export function ReportPetList({ reports, status }: ReportPetListProps) {
    if (reports.length === 0) {
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
    
    // Transform PetReport to a structure compatible with PetCard
    const petsForCard: Pet[] = reports.map(report => ({
        id: report.pet,
        name: report.pet_name,
        pet_image: report.report_image,
        pet_report: report,
        // Add other necessary fields for PetCard with defaults
        description: report.message,
        type_name: '', // Not available in PetReport
        gender: 'Unknown',
        age: null,
        weight: null,
        breed: null,
        color: null,
        is_vaccinated: false,
        is_diseased: false,
        address: null,
        city: null,
        pincode: null,
        state: null,
        created_by: 0,
        created_at: '',
        modified_by: null,
        modified_at: '',
        medical_history: null,
        adoption_requests: [],
        available_for_adopt: report.pet_status === 'adopt'
    }));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {petsForCard.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
            ))}
        </div>
    )
}
