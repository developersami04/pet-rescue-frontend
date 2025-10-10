
'use client';

import { useState, useEffect, useCallback } from 'react';
import { deletePetRequest, getAllPets } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Pet } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AdminPetCard } from './admin-pet-card';
import { AdminPetListItem } from './admin-pet-list-item';

function PetsSkeleton({ view }: { view: 'grid' | 'list' }) {
    const CardSkeleton = () => (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-56 w-full rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );

    const ListSkeleton = () => (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
        </div>
    );
    
    return (
        view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
        ) : (
            <div className="space-y-4">
                 {[...Array(8)].map((_, i) => <ListSkeleton key={i} />)}
            </div>
        )
    );
}

export function ManagePetsClient() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [deletingPets, setDeletingPets] = useState<Record<number, boolean>>({});
    const router = useRouter();
    const { toast } = useToast();

    const fetchPets = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to manage pets.');
            setIsLoading(false);
            return;
        }

        try {
            const petsData = await getAllPets(token, 'All');
            setPets(petsData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch pets.');
                toast({ variant: 'destructive', title: 'Failed to fetch pets' });
            }
        }
    }, [toast, router]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchPets();
        setIsRefreshing(false);
    }

    const handleDeletePet = useCallback(async (petId: number) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            return;
        }

        setDeletingPets(prev => ({ ...prev, [petId]: true }));

        try {
            await deletePetRequest(token, String(petId));
            toast({ title: 'Pet Deleted', description: 'The pet has been successfully removed.' });
            
            setPets(prevPets => prevPets.filter(p => p.id !== petId));

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message });
        } finally {
            setDeletingPets(prev => ({ ...prev, [petId]: false }));
        }
    }, [toast]);

    useEffect(() => {
        setIsLoading(true);
        fetchPets().finally(() => setIsLoading(false));
    }, [fetchPets]);
    
    if (error) {
        return (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="mt-6">
            <div className="flex items-center justify-end mb-4 gap-4">
                 <Button onClick={handleRefresh} disabled={isRefreshing || isLoading}>
                    {(isRefreshing || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Refresh
                </Button>
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

            {isLoading ? (
                <PetsSkeleton view={view} />
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {pets.map((pet) => (
                        <AdminPetCard 
                            key={pet.id} 
                            pet={pet}
                            onDelete={handleDeletePet}
                            isDeleting={deletingPets[pet.id]}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {pets.map((pet) => (
                        <AdminPetListItem 
                            key={pet.id} 
                            pet={pet}
                            onDelete={handleDeletePet}
                            isDeleting={deletingPets[pet.id]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
