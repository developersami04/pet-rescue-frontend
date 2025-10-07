
'use client';

import { Card } from "@/components/ui/card";
import { Pet } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, MoreVertical, ShieldCheck, ThumbsDown, X } from 'lucide-react';

type AdminReportListItemProps = {
    pet: Pet;
}

export function AdminReportListItem({ pet }: AdminReportListItemProps) {
    const imageUrl = pet.pet_image || `https://picsum.photos/seed/${pet.id}/100/100`;
    const petStatus = pet.pet_report?.pet_status;
    const isResolved = pet.pet_report?.is_resolved;

    const reportedDate = pet.created_at ? new Date(pet.created_at) : null;
    const isValidDate = reportedDate && !isNaN(reportedDate.getTime());

    return (
        <Card className="p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={pet.breed ?? pet.type_name}
                />
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-5 items-center gap-4">
                <div className="col-span-2">
                    <Link href={`/pets/${pet.id}`} className="hover:underline">
                        <h3 className="text-lg font-bold">{pet.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{pet.type_name} / {pet.breed || 'N/A'}</p>
                     <p className="text-xs text-muted-foreground mt-1">
                        {isValidDate
                            ? `Reported ${formatDistanceToNow(reportedDate, { addSuffix: true })}`
                            : "Date not available"}
                    </p>
                </div>
                 <div>
                     {petStatus && !isResolved && (
                        <Badge 
                            className={cn("capitalize", 
                                petStatus === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 
                                petStatus === 'found' ? 'bg-blue-500 text-white' :
                                'bg-green-500 text-white'
                            )}
                            >
                                {petStatus}
                        </Badge>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium">{pet.pet_report?.reporter_name || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Reporter</p>
                </div>
                 <div className="flex justify-end items-center gap-2">
                     <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
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
                                <X className="mr-2 h-4 w-4" />
                                <span>Resolve</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    )
}
