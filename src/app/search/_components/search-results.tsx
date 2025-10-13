
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Pet } from '@/lib/data';
import { searchPets } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { PetCard } from '@/app/pets/_components/pet-card';
import { PetListItem } from '@/app/pets/_components/pet-list-item';
import { PageHeader } from '@/components/page-header';
import { LoginPromptDialog } from '@/components/login-prompt-dialog';

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

export function SearchResults() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const fetchPets = useCallback(async () => {
    if (!query) {
        setPets([]);
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setShowLoginPrompt(true);
      setIsLoading(false);
      return;
    }

    try {
      const petsData = await searchPets(token, query);
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
        const errorMessage = e.message || 'Failed to fetch search results.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Search Failed',
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, toast, router]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);
  
  if (showLoginPrompt) {
      return <LoginPromptDialog isOpen={showLoginPrompt} />;
  }

  return (
    <>
      <PageHeader
        title={query ? `Search Results for "${query}"` : "Search"}
        description={!isLoading && query ? `${pets.length} pet(s) found.` : (query ? 'Searching...' : 'Please enter a search term.')}
      />
      <div className="mb-8 flex justify-end">
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
         <PetListSkeleton view={view} />
      ) : error ? (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
            {pets.length === 0 && query ? (
                <div className="text-center py-16 col-span-full">
                <h3 className="text-xl font-semibold">No Pets Found</h3>
                <p className="text-muted-foreground mt-2">
                    Try adjusting your search query to find more friends.
                </p>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {pets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {pets.map((pet) => (
                        <PetListItem key={pet.id} pet={pet} />
                    ))}
                </div>
            )}
        </>
      )}
    </>
  );
}
