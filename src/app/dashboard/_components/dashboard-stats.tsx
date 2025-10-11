
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, AlertTriangle, Search, FileText, Hand, Inbox, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyPets, getMyPetData, getFavoritePets } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pet, PetReport, MyAdoptionRequest, AdoptionRequest } from "@/lib/data";


function StatCard({ title, value, icon, isLoading }: { title: string, value: number | null, icon: React.ReactNode, isLoading: boolean }) {
    if (isLoading || value === null) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                       {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export function DashboardStats() {
    const { toast } = useToast();
    const router = useRouter();

    const [counts, setCounts] = useState({
        myPetsCount: null as number | null,
        lostPetsCount: null as number | null,
        foundPetsCount: null as number | null,
        adoptablePetsCount: null as number | null,
        myRequestsCount: null as number | null,
        adoptionRequestsReceivedCount: null as number | null,
        favoritePetsCount: null as number | null,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllCounts = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            const fetchers = {
                myPetsCount: () => getMyPets(token),
                lostPetsCount: () => getMyPetData(token, 'lost'),
                foundPetsCount: () => getMyPetData(token, 'found'),
                adoptablePetsCount: () => getMyPetData(token, 'adopt'),
                myRequestsCount: () => getMyPetData(token, 'my-adoption-requests'),
                adoptionRequestsReceivedCount: () => getMyPetData(token, 'adoption-requests-received'),
                favoritePetsCount: () => getFavoritePets(token),
            };

            const newCounts = { ...counts };
            let hasError = false;

            for (const [key, fetcher] of Object.entries(fetchers)) {
                try {
                    const result = await fetcher();
                    if(result) {
                        newCounts[key as keyof typeof newCounts] = result.length;
                    } else {
                        newCounts[key as keyof typeof newCounts] = 0; // Default to 0 on failure or null response
                    }
                    setCounts({ ...newCounts });
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
                        return; // Stop fetching if session is expired
                    } else {
                        console.error(`Failed to fetch count for ${key}:`, error);
                        hasError = true;
                        newCounts[key as keyof typeof newCounts] = 0; // Still update state on error
                        setCounts({ ...newCounts });
                    }
                }
            }
            
            if (hasError) {
                toast({ variant: 'destructive', title: 'Error', description: `Could not fetch some dashboard data.` });
            }

            setIsLoading(false);
        };

        fetchAllCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const stats = [
        { title: "My Pets", value: counts.myPetsCount, icon: <PawPrint className="h-6 w-6" /> },
        { title: "Lost Pets", value: counts.lostPetsCount, icon: <AlertTriangle className="h-6 w-6" /> },
        { title: "Found Pets", value: counts.foundPetsCount, icon: <Search className="h-6 w-6" /> },
        { title: "Adoptable Pets", value: counts.adoptablePetsCount, icon: <Hand className="h-6 w-6" /> },
        { title: "My Requests", value: counts.myRequestsCount, icon: <FileText className="h-6 w-6" /> },
        { title: "Favorites", value: counts.favoritePetsCount, icon: <Heart className="h-6 w-6" /> },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {stats.map(stat => (
                 <StatCard 
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    isLoading={isLoading && stat.value === null}
                 />
            ))}
        </div>
    );
}
