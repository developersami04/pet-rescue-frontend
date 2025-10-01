

'use client';

import { Card } from "@/components/ui/card";
import { Search, AlertTriangle, Loader2, LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { PetReport } from "@/lib/data";
import { getMyPetData } from "@/lib/action_api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PetReportListItem } from "./pet-report-list-item";

export function FoundPetsSection() {
    const [foundPets, setFoundPets] = useState<PetReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('grid');
    const { toast } = useToast();
    const router = useRouter();


    useEffect(() => {
        async function fetchFoundPets() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const reports = await getMyPetData(token, 'found');
                setFoundPets(reports as PetReport[]);
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
                    console.error("Failed to fetch found pets:", error);
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Could not fetch found pet reports.',
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchFoundPets();
    }, [router, toast]);


    if (isLoading) {
        return (
             <div className="flex items-center justify-center p-8 h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (foundPets.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
                <Search className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No Found Pets Reported</h3>
                <p className="mt-2">This section will show pets that have been reported as found.</p>
            </Card>
        );
    }
    
    return (
        <>
             <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={view === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setView('grid')}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button
                        variant={view === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setView('list')}
                        aria-label="List view"
                    >
                        <List className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {foundPets.map(report => {
                        const imageUrl = report.report_image ?? `https://picsum.photos/seed/${report.pet}/300/300`;
                        return (
                            <Card key={report.id} className="overflow-hidden flex flex-col">
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={imageUrl}
                                        alt={report.pet_name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={'found pet'}
                                    />
                                    <Badge 
                                        className={cn("absolute bottom-2 right-2 capitalize bg-blue-500 text-white")}
                                    >
                                        Found
                                    </Badge>
                                </div>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold">{report.pet_name}</h3>
                                        <Badge variant={report.is_resolved ? 'default' : 'secondary'} className="capitalize whitespace-nowrap">
                                            {report.is_resolved ? 'Resolved' : 'Active'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground pt-1">Status: {report.report_status}</p>
                                    
                                </div>
                                <div className="p-4 pt-0">
                                    <Button asChild variant="secondary" className="w-full">
                                        <Link href={`/pets/${report.pet}`}>
                                            View Pet Details
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                 <div className="space-y-4">
                    {foundPets.map(report => (
                        <PetReportListItem key={report.id} report={report} />
                    ))}
                </div>
            )}
        </>
    );
}
