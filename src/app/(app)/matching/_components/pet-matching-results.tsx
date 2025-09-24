'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type PetSuggestion = {
  petId: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  imageUrl: string;
  matchReason: string;
};

type PetMatchingState = {
  suggestions?: PetSuggestion[];
  error?: string;
};

type PetMatchingResultsProps = {
  state: PetMatchingState;
};

export function PetMatchingResults({ state }: PetMatchingResultsProps) {
  // A bit of a workaround to detect loading state from useFormState
  const isLoading =
    Object.keys(state).length === 0 &&
    typeof document !== 'undefined' &&
    (document.activeElement as HTMLButtonElement)?.type === 'submit';

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-56 w-full rounded-t-lg" />
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (state?.error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }

  if (state?.suggestions) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Your Pet Matches
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state.suggestions.map((pet) => (
            <Card key={pet.petId} className="flex flex-col overflow-hidden">
              <div className="relative h-56 w-full">
                <Image
                  src={pet.imageUrl}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  data-ai-hint={`${pet.breed}`}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline tracking-wide">
                  {pet.name}
                </CardTitle>
                <CardDescription>
                  {pet.breed} &bull; {pet.age}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {pet.description}
                </p>
                <div>
                  <h5 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" /> Match Reason
                  </h5>
                  <p className="text-sm text-muted-foreground italic">
                    "{pet.matchReason}"
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={`/pets/${pet.petId}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
