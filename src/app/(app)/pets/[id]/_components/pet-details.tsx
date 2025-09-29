

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Pet } from '@/lib/data';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

type PetDetailsProps = {
  pet: Pet;
};

export function PetDetails({ pet }: PetDetailsProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  // The new API response does not include 'available_for_adopt' directly in the root.
  // We need to determine this from the context. A pet with an active "lost" report
  // or an approved adoption request is likely not available.
  const isLost = pet.pet_report?.some(r => r.pet_status === 'lost' && !r.is_resolved) ?? false;
  const isAdopted = pet.adoption_requests?.some(r => r.is_approved) ?? false;
  const isAvailableForAdoption = !isLost && !isAdopted;


  return (
    <div className="grid gap-4 md:gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            {pet.name}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Like"
          >
            <Heart
              className={cn(
                'h-7 w-7',
                isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              )}
            />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{pet.type_name}</Badge>
          <Badge variant="secondary">{pet.breed || 'Unknown Breed'}</Badge>
           {pet.age !== null && (
            <Badge variant="secondary">
                {pet.age} {pet.age === 1 ? 'year' : 'years'} old
            </Badge>
          )}
          <Badge variant="secondary">{pet.gender}</Badge>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">{pet.description || "No description available."}</p>
        </CardContent>
      </Card>
      <div className="grid gap-2">
        <h3 className="font-semibold">Additional Details</h3>
        <Separator />
        <div className="grid grid-cols-2 text-sm gap-y-2">
          <p className="text-muted-foreground">ID:</p>
          <p>{pet.id}</p>
          <p className="text-muted-foreground">Color:</p>
          <p>{pet.color || 'N/A'}</p>
          <p className="text-muted-foreground">Status:</p>
          <div>
            {isLost ? <Badge variant="destructive">Lost</Badge> : 
             isAdopted ? <Badge>Adopted</Badge> : 
             <Badge variant="secondary">Available</Badge>
            }
            </div>
           <p className="text-muted-foreground">Location:</p>
          <p>{pet.city || 'N/A'}, {pet.state || 'N/A'}</p>
          <p className="text-muted-foreground">Vaccinated:</p>
          <p>{pet.is_vaccinated ? 'Yes' : 'No'}</p>
        </div>
      </div>
      <Button size="lg" asChild className="w-full" disabled={!isAvailableForAdoption}>
        <Link href={`/pets/${pet.id}/adopt`}>Adopt {pet.name}</Link>
      </Button>
    </div>
  );
}
