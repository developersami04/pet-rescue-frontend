
'use client';

import { AdoptionRequest } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Inbox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

type AdoptionRequestsReceivedSectionProps = {
    requests: AdoptionRequest[];
    onUpdate: () => void;
};

function RequestItem({ request, onUpdate }: { request: AdoptionRequest, onUpdate: () => void }) {
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
                    <Badge variant={getStatusVariant(request.status)} className="capitalize mb-2">
                        {request.status}
                    </Badge>
                     {request.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline">Reject</Button>
                            <Button size="sm">Approve</Button>
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
