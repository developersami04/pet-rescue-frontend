
'use client';

import { Card } from "@/components/ui/card";
import { FileText, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { MyAdoptionRequest } from "@/lib/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { AdoptionRequestListItem } from "./adoption-request-list-item";
import Link from "next/link";

type MyRequestsSectionProps = {
    requests: MyAdoptionRequest[];
}

export function MyRequestsSection({ requests }: MyRequestsSectionProps) {
    const [view, setView] = useState('grid');
    
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

    if (requests.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
                <FileText className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No Adoption Requests Made</h3>
                <p className="mt-2">This section will show the status of adoption requests you have submitted.</p>
            </Card>
        );
    }
    
     return (
         <>
            <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={view === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setView('grid')}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button
                        variant={view === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setView('list')}
                        aria-label="List view"
                    >
                        <List className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {requests.map(req => {
                        const imageUrl = `https://picsum.photos/seed/${req.pet}/300/300`;
                        return (
                            <Card key={req.id} className="overflow-hidden flex flex-col">
                                 <Link href={`/pets/${req.pet}`} className="group">
                                    <div className="relative aspect-square w-full">
                                        <Image
                                            src={imageUrl}
                                            alt={req.pet_name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            data-ai-hint={'pet'}
                                        />
                                    </div>
                                </Link>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link href={`/pets/${req.pet}`} className="hover:underline">
                                                <h3 className="text-lg font-bold">{req.pet_name}</h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground">Owner: {req.owner_name}</p>
                                        </div>
                                        <Badge variant={getStatusVariant(req.status)} className="capitalize">
                                            {req.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground pt-1">
                                        Requested {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </Card>
                        )
                    })}
                </div>
             ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <AdoptionRequestListItem key={req.id} request={req} />
                    ))}
                </div>
             )}
        </>
    );
}
