
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
          <Badge variant="secondary">{pet.type}</Badge>
          <Badge variant="secondary">{pet.breed}</Badge>
          <Badge variant="secondary">
            {pet.age} {pet.age > 1 ? 'years' : 'year'}
          </Badge>
          <Badge variant="secondary">{pet.size}</Badge>
          <Badge variant="secondary">{pet.gender}</Badge>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">{pet.description}</p>
        </CardContent>
      </Card>
      <div className="grid gap-2">
        <h3 className="font-semibold">Additional Details</h3>
        <Separator />
        <div className="grid grid-cols-2 text-sm">
          <p className="text-muted-foreground">ID:</p>
          <p>{pet.id}</p>
          <p className="text-muted-foreground">Status:</p>
          <p>Available for Adoption</p>
          <p className="text-muted-foreground">Location:</p>
          <p>Shelter Name</p>
        </div>
      </div>
      <Button size="lg" asChild className="w-full">
        <Link href={`/pets/${pet.id}/adopt`}>Adopt {pet.name}</Link>
      </Button>
    </div>
  );
}
