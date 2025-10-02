
'use client';

import { Card } from "@/components/ui/card";
import { MyAdoptionRequest } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Check, FileText, X } from "lucide-react";
import Link from "next/link";

type AdoptionRequestListItemProps = {
    request: MyAdoptionRequest;
}

export function AdoptionRequestListItem({ request }: AdoptionRequestListItemProps) {
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
        <Card className="p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={request.pet_name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={'pet'}
                />
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="md:col-span-2">
                    <Link href={`/pets/${request.pet}`} className="hover:underline">
                        <h3 className="text-lg font-bold">{request.pet_name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Owner: {request.owner_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Requested {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
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
        </Card>
    )
}
