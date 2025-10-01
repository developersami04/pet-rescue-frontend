

'use client';

import { Card } from "@/components/ui/card";
import { MyAdoptionRequest } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Check, FileText, X } from "lucide-react";

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
            <div className="flex-grow grid grid-cols-5 items-center gap-4">
                <div className="col-span-2">
                    <h3 className="text-lg font-bold">{request.pet_name}</h3>
                    <p className="text-sm text-muted-foreground">
                        Requested {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </p>
                </div>
                <div>
                     <Badge variant={getStatusVariant(request.status)} className="capitalize">
                        <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status}
                        </div>
                    </Badge>
                </div>
                <div className="col-span-2 flex justify-end">
                     <Button asChild variant="secondary">
                        <Link href={`/pets/${request.pet}`}>
                            View Pet
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    )
}
