

'use client';

import { Card } from "@/components/ui/card";
import { AdoptionRequest } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreVertical, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { NotifyUserDialog } from "./notify-user-dialog";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";
import { UserDetailsDialog } from "@/components/user-details-dialog";

type RequestStatus = 'approved' | 'rejected';

type AdoptionRequestListItemProps = {
    request: AdoptionRequest;
    onUpdate: (requestId: number, status: RequestStatus, message?: string) => void;
    onDelete: (requestId: number) => void;
    isUpdating: boolean;
}

export function AdoptionRequestListItem({ request, onUpdate, onDelete, isUpdating }: AdoptionRequestListItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const petImageUrl = request.pet_image || `https://picsum.photos/seed/${request.pet}/100/100`;
    const defaultRequesterImage = getRandomDefaultProfileImage(request.requester_name);
    const requesterImageUrl = request.requester_profile_image || defaultRequesterImage;

    const requestedDate = request.created_at ? new Date(request.created_at) : null;
    const isValidDate = requestedDate && !isNaN(requestedDate.getTime());
    
    const getStatusVariant = (status?: string | null) => {
        switch (status?.toLowerCase()) {
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
                        <AvatarImage src={petImageUrl} alt={request.pet_name} className="object-cover" />
                        <AvatarFallback>{request.pet_name?.[0] ?? 'P'}</AvatarFallback>
                    </Avatar>
                </Link>
                <UserDetailsDialog userId={request.requester_id}>
                     <Avatar className="h-20 w-20 cursor-pointer">
                        <AvatarImage src={requesterImageUrl} alt={request.requester_name} className="object-cover" />
                        <AvatarFallback>{request.requester_name?.[0] ?? 'U'}</AvatarFallback>
                    </Avatar>
                </UserDetailsDialog>
            </div>
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 items-start gap-4 w-full">
                <div className="md:col-span-2 space-y-2">
                    <div>
                         <h3 className="text-lg font-bold">
                            <UserDetailsDialog userId={request.requester_id}>
                                <span className="hover:underline cursor-pointer">{request.requester_name}</span>
                            </UserDetailsDialog>
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
                     <p className="text-sm text-muted-foreground italic bg-muted/50 p-3 rounded-md">"{request.message}"</p>
                </div>
                
                 <div className="flex flex-col items-start md:items-end gap-2 self-start md:self-center">
                    <Badge variant={getStatusVariant(request.report_status)} className="capitalize mb-2">
                        {request.report_status || 'pending'}
                    </Badge>
                    <div className="flex gap-2">
                            <NotifyUserDialog
                            action="rejected"
                            request={request}
                            onConfirm={(message) => onUpdate(request.id, 'rejected', message)}
                            isUpdating={isUpdating}
                        >
                            <Button size="sm" variant="destructive" disabled={isUpdating || request.report_status === 'rejected'}>
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                        </NotifyUserDialog>
                        <NotifyUserDialog
                            action="approved"
                            request={request}
                            onConfirm={(message) => onUpdate(request.id, 'approved', message)}
                            isUpdating={isUpdating}
                        >
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={isUpdating || request.report_status === 'approved'}>
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                        </NotifyUserDialog>
                    </div>
                </div>
            </div>
            <div className="ml-auto self-start sm:self-center">
                 <AlertDialog>
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
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
                                This action cannot be undone. This will permanently delete this adoption request.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { onDelete(request.id); setIsMenuOpen(false); }} disabled={isUpdating}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    )
}
