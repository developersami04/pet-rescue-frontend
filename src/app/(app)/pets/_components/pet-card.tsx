
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Pet } from '@/lib/data';
import { PawPrint } from 'lucide-react';

type PetCardProps = {
  pet: Pet;
};

export function PetCard({ pet }: PetCardProps) {
  const imageUrl = pet.image ?? `https://picsum.photos/seed/${pet.id}/400/300`;

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative h-56 w-full">
        <Image
          src={imageUrl}
          alt={pet.name}
          fill
          className="object-cover"
          data-ai-hint={pet.breed ?? pet.type_name}
        />
         {!pet.image && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PawPrint className="h-12 w-12 text-white/50" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="font-headline tracking-wide">{pet.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {pet.breed || 'Unknown Breed'} &bull; {pet.age ?? 'Unknown'} {pet.age === 1 ? 'year' : 'years'} old
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/pets/${pet.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
