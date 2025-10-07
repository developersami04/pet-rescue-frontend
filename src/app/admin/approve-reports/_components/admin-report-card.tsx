
'use client';

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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, MoreVertical, ShieldCheck, ThumbsDown, X } from 'lucide-react';

type AdminReportCardProps = {
  pet: Pet;
};

export function AdminReportCard({ pet }: AdminReportCardProps) {
  const imageUrl = pet.pet_image || `https://picsum.photos/seed/${pet.id}/400/300`;
  const petStatus = pet.pet_report?.pet_status;
  const isResolved = pet.pet_report?.is_resolved;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <Link href={`/pets/${pet.id}`} className="group">
            <div className="relative h-56 w-full">
            <Image
                src={imageUrl}
                alt={pet.name}
                fill
                className="object-cover"
                data-ai-hint={pet.breed ?? pet.type_name}
            />
            {petStatus && !isResolved && (
                <Badge 
                className={cn("absolute top-2 left-2 capitalize", 
                    petStatus === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 'bg-blue-500 text-white'
                )}
                >
                    {petStatus}
                </Badge>
            )}
            </div>
      </Link>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline tracking-wide flex items-center gap-2">
                <Link href={`/pets/${pet.id}`} className="hover:underline">
                    {pet.name}
                </Link>
            </CardTitle>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Approve</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        <span>Reject</span>
                    </DropdownMenuItem>
                     <DropdownMenuItem>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Resolve</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {pet.breed || 'Unknown Breed'} &bull; {pet.age ?? 'Unknown'} {pet.age === 1 ? 'year' : 'years'} old
        </p>
         <p className="text-sm text-muted-foreground mt-1">
          Reported by: {pet.pet_report?.reporter_name || 'N/A'}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 !p-4">
        <Button className="w-full bg-green-600 hover:bg-green-700">
            <ShieldCheck className="mr-2 h-4 w-4" /> Approve
        </Button>
        <div className="flex w-full gap-2">
             <Button variant="destructive" className="w-full">
                <ThumbsDown className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button variant="secondary" className="w-full">
                <X className="mr-2 h-4 w-4" /> Resolve
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
