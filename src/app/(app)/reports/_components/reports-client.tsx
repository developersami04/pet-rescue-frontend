
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllPets } from '@/lib/actions/pet.actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Pet } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ReportTabs } from './report-tabs';
import { ReportPetList } from './report-pet-list';

function ReportsSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                     <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-56 w-full rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ReportsClient() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'adopt'>('lost');
    const { toast } = useToast();
    const router = useRouter();

    const fetchPets = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to view reports.');
            setIsLoading(false);
            return;
        }

        try {
            const petsData = await getAllPets(token);
            setPets(petsData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch pet reports.');
                toast({ variant: 'destructive', title: 'Failed to fetch reports' });
            }
        } finally {
            setIsLoading(false);
        }
    }, [toast, router]);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    const filteredPets = useMemo(() => {
        return pets.filter(pet => {
            if (activeTab === 'adopt') {
                return pet.available_for_adopt;
            }
            return pet.pet_status === activeTab;
        });
    }, [pets, activeTab]);

    if (isLoading) {
        return <ReportsSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <ReportTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} />
            <div className="mt-6">
                <TabsContent value="lost">
                    <ReportPetList pets={filteredPets} status="lost" />
                </TabsContent>
                <TabsContent value="found">
                    <ReportPetList pets={filteredPets} status="found" />
                </TabsContent>
                <TabsContent value="adopt">
                    <ReportPetList pets={filteredPets} status="adopt" />
                </TabsContent>
            </div>
        </Tabs>
    );
}
