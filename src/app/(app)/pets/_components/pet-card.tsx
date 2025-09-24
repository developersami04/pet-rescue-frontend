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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Pet } from '@/lib/data';

type PetCardProps = {
  pet: Pet;
};

export function PetCard({ pet }: PetCardProps) {
  const petImage = PlaceHolderImages.find((p) => p.id === pet.imageIds[0]);

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative h-56 w-full">
        {petImage && (
          <Image
            src={petImage.imageUrl}
            alt={pet.name}
            fill
            className="object-cover"
            data-ai-hint={petImage.imageHint}
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="font-headline tracking-wide">{pet.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {pet.breed} &bull; {pet.age} {pet.age > 1 ? 'years' : 'year'} old
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
