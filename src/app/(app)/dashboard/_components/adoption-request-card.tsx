
'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MyAdoptionRequest } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { UpdateAdoptionRequestDialog } from "./update-adoption-request-dialog";
import { DeleteAdoptionRequestDialog } from "./delete-adoption-request-dialog";

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) {
      const years = Math.floor(interval);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      const months = Math.floor(interval);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      const days = Math.floor(interval);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      const hours = Math.floor(interval);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
      const minutes = Math.floor(interval);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    return `${Math.floor(seconds)} second${Math.floor(seconds) !== 1 ? 's' : ''} ago`;
}

type AdoptionRequestCardProps = {
    request: MyAdoptionRequest;
    onUpdate: () => void;
}

export function AdoptionRequestCard({ request, onUpdate }: AdoptionRequestCardProps) {
    const imageUrl = `https://picsum.photos/seed/${request.pet}/300/300`;

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
        <Card className="overflow-hidden flex flex-col">
            <Link href={`/pets/${request.pet}`} className="group">
                <div className="relative aspect-square w-full">
                    <Image
                        src={imageUrl}
                        alt={request.pet_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={'pet'}
                    />
                </div>
            </Link>
            <CardHeader className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <Link href={`/pets/${request.pet}`} className="hover:underline">
                            <h3 className="text-lg font-bold">{request.pet_name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">Owner: {request.owner_name}</p>
                    </div>
                    <Badge variant={getStatusVariant(request.status)} className="capitalize">
                        {request.status}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground pt-1">
                    Requested {timeAgo(request.created_at)}
                </p>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex gap-2">
                <UpdateAdoptionRequestDialog request={request} onUpdate={onUpdate}>
                    <Button variant="outline" className="w-full">
                        <Pen className="mr-2 h-4 w-4" /> Edit
                    </Button>
                </UpdateAdoptionRequestDialog>
                 <DeleteAdoptionRequestDialog requestId={request.id} onDeleted={onUpdate}>
                    <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </DeleteAdoptionRequestDialog>
            </CardFooter>
        </Card>
    )
}
