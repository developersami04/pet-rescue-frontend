
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pets, organizations } from "@/lib/data";
import { PawPrint, Home, Users, Dog } from "lucide-react";

type PetType = {
  type: string;
};

async function getPetTypes() {
    try {
        const response = await fetch('https://f3gzr7pv-8000.inc1.devtunnels.ms/api/pet-data/pet-types/', { cache: 'no-store' });
        if (!response.ok) {
            console.error('Failed to fetch pet types:', response.statusText);
            return null;
        }
        const data: PetType[] = await response.json();
        return data.length;
    } catch (error) {
        console.error('Error fetching pet types:', error);
        return null;
    }
}

export async function DashboardStats() {
    const petTypesCount = await getPetTypes();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Pets</CardTitle>
                    <PawPrint className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pets.length}</div>
                    <p className="text-xs text-muted-foreground">
                        ready for their forever homes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Rescue Organizations
                    </CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{organizations.length}</div>
                    <p className="text-xs text-muted-foreground">
                        partnered with us to save lives
                    </p>
                </CardContent>
            </Card>
            {petTypesCount !== null && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pet Categories</CardTitle>
                        <Dog className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{petTypesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            different types of pets available
                        </p>
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Happy Adoptions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+1,234</div>
                    <p className="text-xs text-muted-foreground">
                        pets have found loving families
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
