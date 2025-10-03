
'use client';

import { Card } from "@/components/ui/card";
import { MyAdoptionRequest } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Pen, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UpdateAdoptionRequestDialog } from "./update-adoption-request-dialog";
import { DeleteAdoptionRequestDialog } from "./delete-adoption-request-dialog";

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

type AdoptionRequestListItemProps = {
    request: MyAdoptionRequest;
    onUpdate: () => void;
}

export function AdoptionRequestListItem({ request, onUpdate }: AdoptionRequestListItemProps) {
    const imageUrl = `https://picsum.photos/seed/${request.pet}/100/100`;

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
     const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
        case 'approved':
            return <Check className="h-3 w-3" />;
        case 'rejected':
            return <X className="h-3 w-3" />;
        case 'pending':
        default:
            return <FileText className="h-3 w-3" />;
        }
    };

    return (
        <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={request.pet_name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={'pet'}
                />
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-4 w-full">
                <div className="md:col-span-2">
                    <Link href={`/pets/${request.pet}`} className="hover:underline">
                        <h3 className="text-lg font-bold">{request.pet_name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Owner: {request.owner_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Requested {timeAgo(request.created_at)}
                    </p>
                </div>
                <div className="flex justify-start md:justify-end">
                     <Badge variant={getStatusVariant(request.status)} className="capitalize">
                        <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status}
                        </div>
                    </Badge>
                </div>
            </div>
             <div className="flex sm:flex-col md:flex-row gap-2 self-end sm:self-center">
                <UpdateAdoptionRequestDialog request={request} onUpdate={onUpdate}>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                        <Pen className="h-4 w-4" />
                        <span className="sr-only">Edit Request</span>
                    </Button>
                </UpdateAdoptionRequestDialog>
                 <DeleteAdoptionRequestDialog requestId={request.id} onDeleted={onUpdate}>
                    <Button size="icon" variant="destructive" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Request</span>
                    </Button>
                </DeleteAdoptionRequestDialog>
            </div>
        </Card>
    )
}
