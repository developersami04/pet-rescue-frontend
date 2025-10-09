
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Pet } from '@/lib/data';
import { PetCard } from './pet-card';
import { PetFilters } from './pet-filters';
import { getAllPets, getPetTypes } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { PetListItem } from './pet-list-item';

function PetListSkeleton({ view }: { view: 'grid' | 'list' }) {
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


export function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [petTypes, setPetTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const fetchPets = useCallback(async (selectedType: string) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to view pets.');
      setIsLoading(false);
      return;
    }

    try {
      const petsData = await getAllPets(token, selectedType);
      setPets(petsData);
    } catch (e: any) {
      if (e.message.includes('Session expired')) {
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
        const errorMessage = e.message || 'Failed to fetch pets.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch pets',
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, router]);

  useEffect(() => {
    fetchPets(type);
  }, [type, fetchPets]);

  useEffect(() => {
    async function fetchPetTypes() {
        try {
            const types = await getPetTypes();
            if (types) {
                setPetTypes(types.map(t => t.name));
            }
        } catch (error: any) {
            console.error("Failed to fetch pet types for filter", error);
            toast({
                variant: 'destructive',
                title: 'Error fetching pet types',
                description: error.message || 'Could not load pet type filters.'
            })
        }
    }
    fetchPetTypes();
  }, [toast]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const searchLower = search.toLowerCase();
      return (
        pet.name.toLowerCase().includes(searchLower) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchLower))
      );
    });
  }, [search, pets]);
  
  const handleClearFilters = () => {
    setSearch('');
    setType('All');
  };

  return (
    <>
      <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm flex flex-col gap-4">
        <PetFilters
            search={search}
            setSearch={setSearch}
            type={type}
            setType={setType}
            petTypes={petTypes}
            onClearFilters={handleClearFilters}
        />
        <div className="flex items-center justify-end">
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
      </div>
      {isLoading ? (
         <PetListSkeleton view={view} />
      ) : error ? (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
            {filteredPets.length === 0 ? (
                <div className="text-center py-16 col-span-full">
                <h3 className="text-xl font-semibold">No Pets Found</h3>
                <p className="text-muted-foreground mt-2">
                    Try adjusting your filters to find more friends.
                </p>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredPets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredPets.map((pet) => (
                        <PetListItem key={pet.id} pet={pet} />
                    ))}
                </div>
            )}
        </>
      )}
    </>
  );
}
