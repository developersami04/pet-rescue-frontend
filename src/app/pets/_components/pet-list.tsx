
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

function PetListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-56 w-full rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    )
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

  const fetchPets = useCallback(async (selectedType: string) => {
    setIsLoading(true);
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
        setError(e.message || 'Failed to fetch pets.');
        toast({
          variant: 'destructive',
          title: 'Failed to fetch pets',
          description: e.message || 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, router]);

  useEffect(() => {
    fetchPets(type);
  }, [type]);

  useEffect(() => {
    async function fetchPetTypes() {
        try {
            const types = await getPetTypes();
            if (types) {
                setPetTypes(types.map(t => t.name));
            }
        } catch (error) {
            console.error("Failed to fetch pet types for filter", error);
        }
    }
    fetchPetTypes();
  }, []);

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
      <PetFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        petTypes={petTypes}
        onClearFilters={handleClearFilters}
      />
      {isLoading ? (
         <PetListSkeleton />
      ) : error ? (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
                ))}
            </div>
            {filteredPets.length === 0 && !isLoading && (
                <div className="text-center py-16 col-span-full">
                <h3 className="text-xl font-semibold">No Pets Found</h3>
                <p className="text-muted-foreground mt-2">
                    Try adjusting your filters to find more friends.
                </p>
                </div>
            )}
        </>
      )}
    </>
  );
}
