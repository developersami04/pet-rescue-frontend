
'use client';

import { AdoptionRequest } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Inbox, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateReceivedAdoptionRequestStatus } from "@/lib/actions";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";

type AdoptionRequestsReceivedSectionProps = {
    requests: AdoptionRequest[];
    onUpdate: () => void;
};

function RequestItem({ request, onUpdate }: { request: AdoptionRequest, onUpdate: () => void }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<'accepted' | 'rejected' | null>(null);

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
        case 'approved':
        case 'accepted':
            return 'default';
        case 'rejected':
            return 'destructive';
        case 'pending':
        default:
            return 'secondary';
        }
    };
    
    const handleStatusUpdate = async (status: 'accepted' | 'rejected') => {
        setIsLoading(status);
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            setIsLoading(null);
            return;
        }

        try {
            await updateReceivedAdoptionRequestStatus(token, request.id, status);
            toast({ title: 'Request Updated', description: `The request has been ${status}.` });
            onUpdate(); // This will trigger a re-fetch in the parent component
        } catch (error: any) {
            if (error.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
            }
        } finally {
            setIsLoading(null);
        }
    };
    
    const defaultRequesterImage = getRandomDefaultProfileImage(request.requester_name);

    return (
        <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="flex-shrink-0">
                <Link href={`/pets/${request.pet}`}>
                    <div className="relative h-20 w-20">
                         <Image
                            src={request.pet_image || `https://picsum.photos/seed/${request.pet}/100/100`}
                            alt={request.pet_name}
                            fill
                            className="object-cover rounded-md"
                            data-ai-hint={'pet'}
                        />
                    </div>
                </Link>
            </div>
             <div className="flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-4 w-full">
                 <div className="md:col-span-2">
                     <h3 className="text-lg font-bold">
                        <Link href={`/profile/${request.requester_id}`} className="hover:underline">{request.requester_name}</Link>
                        <span className="font-normal text-muted-foreground"> wants to adopt </span> 
                        <Link href={`/pets/${request.pet}`} className="hover:underline">{request.pet_name}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground italic mt-1">"{request.message}"</p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </p>
                 </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                    <Badge variant={getStatusVariant(request.report_status || request.status)} className="capitalize mb-2">
                        {request.report_status || request.status}
                    </Badge>
                     {request.report_status === 'pending' && (
                        <div className="flex gap-2">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline" disabled={!!isLoading}>
                                        {isLoading === 'rejected' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Reject
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to reject?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will reject the adoption request from {request.requester_name} for {request.pet_name}. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleStatusUpdate('rejected')}>Confirm Rejection</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" disabled={!!isLoading}>
                                        {isLoading === 'accepted' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Approve
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to approve?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will approve the adoption request from {request.requester_name} for {request.pet_name}. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleStatusUpdate('accepted')}>Confirm Approval</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

export function AdoptionRequestsReceivedSection({ requests, onUpdate }: AdoptionRequestsReceivedSectionProps) {

    if (requests.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
                <Inbox className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No Adoption Requests Received</h3>
                <p className="mt-2">This section will show requests from users who want to adopt your pets.</p>
            </Card>
        );
    }
    
    return (
        <div className="space-y-4">
            {requests.map(request => (
                <RequestItem key={request.id} request={request} onUpdate={onUpdate} />
            ))}
        </div>
    );
}
