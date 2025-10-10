
'use client';

import { Card } from "@/components/ui/card";
import { AdoptionRequest } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type RequestStatus = 'approved' | 'rejected';

type AdoptionRequestListItemProps = {
    request: AdoptionRequest;
    onUpdate: (requestId: number, status: RequestStatus) => void;
    isUpdating: boolean;
}

export function AdoptionRequestListItem({ request, onUpdate, isUpdating }: AdoptionRequestListItemProps) {
    const petImageUrl = request.pet_image || `https://picsum.photos/seed/${request.pet}/100/100`;
    const requesterImageUrl = `https://picsum.photos/seed/${request.requester_name}/100/100`;

    const requestedDate = request.created_at ? new Date(request.created_at) : null;
    const isValidDate = requestedDate && !isNaN(requestedDate.getTime());
    
    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'pending':
            default:
                return 'secondary';
        }
    };

    return (
        <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="flex-shrink-0 flex items-center space-x-4">
                <Link href={`/pets/${request.pet}`}>
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={petImageUrl} alt={request.pet_name} />
                        <AvatarFallback>{request.pet_name?.[0] ?? 'P'}</AvatarFallback>
                    </Avatar>
                </Link>
                <Link href={`/profile/${request.requester_id}`}>
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={requesterImageUrl} alt={request.requester_name} />
                        <AvatarFallback>{request.requester_name?.[0] ?? 'U'}</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-4 w-full">
                <div className="md:col-span-2 space-y-2">
                    <div>
                         <h3 className="text-lg font-bold">
                            <Link href={`/profile/${request.requester_id}`} className="hover:underline">{request.requester_name}</Link>
                            <span className="font-normal text-muted-foreground"> requested </span> 
                            <Link href={`/pets/${request.pet}`} className="hover:underline">{request.pet_name}</Link>
                        </h3>
                         <p className="text-sm text-muted-foreground">
                           Pet Owner: {request.owner_name}
                        </p>
                         <p className="text-xs text-muted-foreground mt-1">
                            {isValidDate
                                ? `Requested ${formatDistanceToNow(requestedDate, { addSuffix: true })}`
                                : "Date not available"}
                        </p>
                    </div>
                     <p className="text-sm text-muted-foreground italic bg-muted/50 p-2 rounded-md">"{request.message}"</p>
                </div>
                
                 <div className="flex flex-col items-start md:items-end gap-2 self-start">
                    <Badge variant={getStatusVariant(request.status)} className="capitalize mb-2">
                        {request.status}
                    </Badge>
                     {request.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button size="sm" variant="destructive" onClick={() => onUpdate(request.id, 'rejected')} disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />}
                                Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onUpdate(request.id, 'approved')} disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                                Approve
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
