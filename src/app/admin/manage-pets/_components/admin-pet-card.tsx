
'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Pet } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Award, BadgeCheck, Loader2, Pen, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { PetTypeIcon } from '@/components/pet-icons';
import Link from 'next/link';

type AdminPetCardProps = {
  pet: Pet;
};

export function AdminPetCard({ pet }: AdminPetCardProps) {
    const placeholder = getPlaceholderImage(pet.type_name);
    const imageUrl = pet.pet_image || placeholder.url;
    const imageHint = pet.pet_image ? pet.type_name : placeholder.hint;
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
    <Card className={cn("flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl")}>
        <Link href={`/pets/${pet.id}`} className="group">
            <div className="relative h-56 w-full">
                <Image
                    src={imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                />
                <div className="absolute top-2 left-2 bg-background/80 p-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                    <PetTypeIcon typeName={pet.type_name} className="h-4 w-4 text-foreground/80" />
                </div>
                 {statusInfo && (
                    <Badge 
                    className={cn("absolute bottom-2 right-2 capitalize", statusInfo.className)}
                    >
                    {statusInfo.text}
                    </Badge>
                )}
            </div>
        </Link>
        <CardHeader className="p-4 flex-grow">
            <div className="flex justify-between items-start">
                 <Link href={`/pets/${pet.id}`} className="hover:underline">
                    <h3 className="text-lg font-bold">{pet.name}</h3>
                </Link>
                <Badge variant={pet.is_verified ? 'default' : 'secondary'} className="capitalize whitespace-nowrap gap-1">
                    {pet.is_verified ? <BadgeCheck className="h-3 w-3"/> : null}
                    {pet.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
            </div>
            <p className="text-sm text-muted-foreground pt-1">{pet.breed || pet.type_name}</p>
        </CardHeader>
        <CardFooter className="p-4 pt-0 flex gap-2">
            <Button asChild variant="outline" className="w-full">
                <Link href={`/submit-request/${pet.id}`}>
                    <Pen className="mr-2 h-4 w-4" /> Edit
                </Link>
            </Button>
            <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
        </CardFooter>
    </Card>
  );
}
