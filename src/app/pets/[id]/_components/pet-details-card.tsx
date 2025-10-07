
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Weight, Palette, MapPin, Cake, PersonStanding } from "lucide-react";
import { PetTypeIcon } from "@/components/pet-icons";


type PetDetailsCardProps = {
    pet: Pet;
}

const DetailRow = ({ icon, label, value, isBadge }: { icon: React.ReactNode, label: string, value: React.ReactNode, isBadge?: boolean }) => {
    if (!value && typeof value !== 'number') return null;
    return (
        <div className="flex items-center text-sm">
            <div className="w-8 flex-shrink-0 text-center text-muted-foreground">{icon}</div>
            <div className="ml-3 font-medium w-28">{label}</div>
            {isBadge ? value : <div className="text-muted-foreground">{value}</div>}
        </div>
    )
}


export function PetDetailsCard({ pet }: PetDetailsCardProps) {

    const fullAddress = [pet.address, pet.city, pet.state, pet.pincode].filter(Boolean).join(', ');
    const isAvailableForAdoption = pet.pet_report?.pet_status === 'adopt' && !pet.pet_report?.is_resolved;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Pet Details</CardTitle>
                <CardDescription>All you need to know about {pet.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <DetailRow 
                    icon={<PetTypeIcon typeName={pet.type_name} className="h-4 w-4" />}
                    label="Type / Breed"
                    value={`${pet.type_name}${pet.breed ? ` / ${pet.breed}` : ''}`}
                />
                 <DetailRow 
                    icon={<PersonStanding className="h-4 w-4" />}
                    label="Gender"
                    value={pet.gender}
                />
                <DetailRow 
                    icon={<Cake className="h-4 w-4" />}
                    label="Age"
                    value={pet.age ? `${pet.age} year(s)` : 'N/A'}
                />
                <DetailRow 
                    icon={<Weight className="h-4 w-4" />}
                    label="Weight"
                    value={pet.weight ? `${pet.weight} kg` : 'N/A'}
                />
                <DetailRow 
                    icon={<Palette className="h-4 w-4" />}
                    label="Color"
                    value={pet.color}
                />
                 <DetailRow 
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={fullAddress || 'N/A'}
                />
                 <DetailRow 
                    icon={<PawPrint className="h-4 w-4" />}
                    label="Status"
                    isBadge
                    value={
                        <div className="flex flex-wrap gap-2">
                            {pet.is_vaccinated && <Badge variant="secondary">Vaccinated</Badge>}
                            {pet.is_diseased && <Badge variant="destructive">Has Disease</Badge>}
                            {isAvailableForAdoption && <Badge variant="default">Ready for Adoption</Badge>}
                        </div>
                    }
                />
            </CardContent>
        </Card>
    );
}
