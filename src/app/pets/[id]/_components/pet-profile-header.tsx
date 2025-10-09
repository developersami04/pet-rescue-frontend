
'use client';

import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Hand, MessageSquareQuote } from "lucide-react";
import { AdoptionRequestDialog } from "./adoption-request-dialog";


type PetProfileHeaderProps = {
    pet: Pet;
    onUpdate: () => void;
}

export function PetProfileHeader({ pet, onUpdate }: PetProfileHeaderProps) {
    const imageUrl = pet.pet_image || `https://picsum.photos/seed/${pet.id}/800/600`;
    const petStatus = pet.pet_report?.pet_status;
    const isResolved = pet.pet_report?.is_resolved;
    const reportStatus = pet.pet_report?.report_status;

    const isAvailableForAdoption = (petStatus === 'adopt' || petStatus === 'found') && !isResolved;

    const getReportStatusVariant = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'pending':
            default:
                return 'secondary';
        }
    };

    return (
       <div className="relative h-96 w-full rounded-lg overflow-hidden bg-muted">
            <Image
                src={imageUrl}
                alt={pet.name}
                fill
                className="object-cover"
                data-ai-hint={pet.breed ?? pet.type_name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-bold font-headline">{pet.name}</h1>
                    {petStatus && !isResolved && (
                        <Badge
                            className={cn("capitalize text-base",
                                petStatus === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 
                                petStatus === 'found' ? 'bg-blue-500 text-white' :
                                petStatus === 'adopt' ? 'bg-green-500 text-white' : ''
                            )}
                        >
                            {petStatus}
                        </Badge>
                    )}
                </div>
                 <p className="mt-2 text-lg max-w-2xl text-white/90">{pet.description}</p>
            </div>
            <div className="absolute top-6 right-6 flex items-start gap-2">
                 {reportStatus && (
                    <div className="flex flex-col items-end">
                        <Badge variant={getReportStatusVariant(reportStatus)} className="capitalize">
                           Admin Status: {reportStatus}
                        </Badge>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    {isAvailableForAdoption && (
                        <AdoptionRequestDialog petId={pet.id} petName={pet.name} onUpdate={onUpdate}>
                            <Button>
                                <Hand className="mr-2 h-4 w-4" />
                                Request to Adopt
                            </Button>
                        </AdoptionRequestDialog>
                    )}
                    <Button variant="secondary">
                        <MessageSquareQuote className="mr-2 h-4 w-4" />
                        Contact Owner
                    </Button>
                </div>
            </div>
       </div>
    );
}
