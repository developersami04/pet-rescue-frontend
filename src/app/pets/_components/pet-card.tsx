
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Pet } from '@/lib/data';
import { PawPrint, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PetCardProps = {
  pet: Pet;
};

export function PetCard({ pet }: PetCardProps) {
  const imageUrl = pet.pet_image || `https://picsum.photos/seed/${pet.id}/400/300`;
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
            src={imageUrl}
            alt={pet.name}
            fill
            className="object-cover"
            data-ai-hint={pet.breed ?? pet.type_name}
          />
          {!pet.pet_image && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PawPrint className="h-12 w-12 text-white/50" />
            </div>
          )}
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
            {pet.is_verified && <BadgeCheck className="h-5 w-5 text-primary" />}
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
