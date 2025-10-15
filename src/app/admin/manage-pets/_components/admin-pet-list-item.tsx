
'use client';

import { Card } from "@/components/ui/card";
import type { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Loader2, MoreVertical, Pen, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { PetTypeIcon } from "@/components/pet-icons";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

type AdminPetListItemProps = {
    pet: Pet;
    onDelete: (petId: number) => void;
    isDeleting: boolean;
}

export function AdminPetListItem({ pet, onDelete, isDeleting }: AdminPetListItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <Card className={cn("p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50")}>
            <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={imageHint}
                />
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-5 items-center gap-4">
                <div className="col-span-2">
                     <Link href={`/pets/${pet.id}`} className="hover:underline">
                        <h3 className="text-lg font-bold">{pet.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <PetTypeIcon typeName={pet.type_name} className="h-4 w-4" />
                        {pet.breed || pet.type_name}
                    </p>
                </div>
                 <div className="col-span-1 flex flex-wrap gap-2">
                    <Badge variant={pet.is_verified ? 'default' : 'secondary'} className="gap-1">
                        {pet.is_verified ? <BadgeCheck className="h-3 w-3"/> : null}
                        {pet.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                     {statusInfo && (
                        <Badge className={cn("capitalize", statusInfo.className)}>
                            {statusInfo.text}
                        </Badge>
                    )}
                </div>
                <div className="col-span-1">
                     <p className="text-sm font-medium">{pet.age ? `${pet.age} yrs` : 'N/A'}</p>
                     <p className="text-xs text-muted-foreground">Age</p>
                </div>
                 <div className="flex justify-end items-center gap-2">
                     <Button size="sm" asChild>
                        <Link href={`/admin/manage-pets/edit/${pet.id}`}>
                            <Pen className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button>
                    <AlertDialog>
                        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete {pet.name}.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    onDelete(pet.id);
                                    setIsMenuOpen(false);
                                }} disabled={isDeleting}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </Card>
    )
}
