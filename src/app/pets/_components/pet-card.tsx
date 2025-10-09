
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Pet } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { PetTypeIcon } from '@/components/pet-icons';

type PetCardProps = {
  pet: Pet;
};

export function PetCard({ pet }: PetCardProps) {
  const imageUrl = pet.pet_image || getPlaceholderImage(pet.type_name);
  const petStatus = pet.pet_report?.pet_status;
  const isResolved = pet.pet_report?.is_resolved;

  const getStatusInfo = (status: string | undefined | null) => {
    if (!status || isResolved) return null;

    switch (status) {
      case 'lost':
        return { text: 'Lost', className: 'bg-destructive/90 text-destructive-foreground' };
      case 'found':
        return { text: 'Found', className: 'bg-blue-500 text-white' };
      case 'adopt':
        return { text: 'Adoptable', className: 'bg-green-500 text-white' };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo(petStatus);

  return (
    <Link href={`/pets/${pet.id}`} className="group">
      <Card className="flex flex-col h-full overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
        <div className="relative h-56 w-full">
          <Image
            src={imageUrl.url}
            alt={pet.name}
            fill
            className="object-cover"
            data-ai-hint={imageUrl.hint}
          />
           <div className="absolute top-2 left-2 bg-background/80 p-1 rounded-full backdrop-blur-sm">
                <PetTypeIcon typeName={pet.type_name} className="h-5 w-5 text-foreground/80" />
            </div>
          {statusInfo && (
            <Badge 
              className={cn("absolute bottom-2 right-2 capitalize", statusInfo.className)}
            >
              {statusInfo.text}
            </Badge>
          )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline tracking-wide flex items-center gap-2">
            {pet.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">
            {pet.breed || pet.type_name || 'Unknown Breed'}
            {pet.age !== null && ` • ${pet.age} ${pet.age === 1 ? 'year' : 'years'} old`}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
