

'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AdoptionRequest } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Loader2, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { NotifyUserDialog } from "./notify-user-dialog";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";
import { UserDetailsDialog } from "@/components/user-details-dialog";

type RequestStatus = 'approved' | 'rejected';

type AdoptionRequestCardProps = {
    request: AdoptionRequest;
    onUpdate: (requestId: number, status: RequestStatus, message?: string) => void;
    onDelete: (requestId: number) => void;
    isUpdating: boolean;
}

export function AdoptionRequestCard({ request, onUpdate, onDelete, isUpdating }: AdoptionRequestCardProps) {
    const petImageUrl = request.pet_image || `https://picsum.photos/seed/${request.pet}/300/300`;
    
    const requestedDate = request.created_at ? new Date(request.created_at) : null;
    const isValidDate = requestedDate && !isNaN(requestedDate.getTime());
    
    const getStatusVariant = (status: string | undefined | null) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'default';
            case 'rejected': return 'destructive';
            case 'pending': default: return 'secondary';
        }
    };
    
    const defaultRequesterImage = getRandomDefaultProfileImage(request.requester_name);

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="p-4 flex flex-row justify-between items-start">
                <div>
                    <CardTitle className="text-lg">
                        <Link href={`/pets/${request.pet}`} className="hover:underline">{request.pet_name}</Link>
                    </CardTitle>
                    <CardDescription className="text-xs">
                       by {request.owner_name}
                    </CardDescription>
                </div>
                 {isValidDate && (
                    <CardDescription className="pt-1 text-xs whitespace-nowrap">
                        {formatDistanceToNow(requestedDate, { addSuffix: true })}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow space-y-4">
                <div className="relative w-full aspect-square rounded-md overflow-hidden">
                    <Image
                        src={petImageUrl}
                        alt={request.pet_name}
                        fill
                        className="object-cover"
                    />
                    <Badge variant={getStatusVariant(request.report_status)} className="capitalize whitespace-nowrap absolute top-2 right-2">
                        {request.report_status || 'pending'}
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={request.requester_profile_image || defaultRequesterImage} alt={request.requester_name} />
                        <AvatarFallback>{request.requester_name?.[0] ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <UserDetailsDialog userId={request.requester_id}>
                            <p className="font-semibold text-sm cursor-pointer hover:underline">
                                {request.requester_name}
                            </p>
                        </UserDetailsDialog>
                        <p className="text-xs text-muted-foreground">Requester</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground italic bg-muted/50 p-3 rounded-md line-clamp-3">"{request.message}"</p>
            </CardContent>
             <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-2">
                <div className="flex w-full gap-2">
                    <NotifyUserDialog
                        action="rejected"
                        request={request}
                        onConfirm={(message) => onUpdate(request.id, 'rejected', message)}
                        isUpdating={isUpdating}
                    >
                        <Button size="sm" variant="outline" className="w-full" disabled={isUpdating || request.report_status === 'rejected'}>
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />}
                            Reject
                        </Button>
                    </NotifyUserDialog>

                    <NotifyUserDialog
                        action="approved"
                        request={request}
                        onConfirm={(message) => onUpdate(request.id, 'approved', message)}
                        isUpdating={isUpdating}
                    >
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" disabled={isUpdating || request.report_status === 'approved'}>
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                            Approve
                        </Button>
                    </NotifyUserDialog>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="w-full" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete Request
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this adoption request.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(request.id)} disabled={isUpdating}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
}
