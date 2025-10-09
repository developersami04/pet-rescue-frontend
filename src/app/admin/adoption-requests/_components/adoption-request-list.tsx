
'use client';

import { AdoptionRequest } from "@/lib/data";
import { Inbox } from "lucide-react";
import { AdoptionRequestListItem } from "./adoption-request-list-item";

type RequestStatus = 'approved' | 'rejected';

type AdoptionRequestListProps = {
    requests: AdoptionRequest[];
    onUpdate: (requestId: number, status: RequestStatus) => void;
    updatingRequests: Record<number, boolean>;
};

export function AdoptionRequestList({ requests, onUpdate, updatingRequests }: AdoptionRequestListProps) {
    
    if (requests.length === 0) {
        return (
            <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg">
                 <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No requests found</h3>
                <p className="text-muted-foreground mt-2">
                    There are currently no requests in this category.
                </p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <AdoptionRequestListItem
                    key={request.id}
                    request={request}
                    onUpdate={onUpdate}
                    isUpdating={updatingRequests[request.id]}
                />
            ))}
        </div>
    )
}
