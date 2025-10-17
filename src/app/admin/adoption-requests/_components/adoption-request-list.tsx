
'use client';

import { AdoptionRequest } from "@/lib/data";
import { Inbox } from "lucide-react";
import { AdoptionRequestListItem } from "./adoption-request-list-item";
import { AdoptionRequestCard } from "./adoption-request-card";

type RequestStatus = 'approved' | 'rejected';

type AdoptionRequestListProps = {
    requests: AdoptionRequest[];
    onUpdate: (requestId: number, status: RequestStatus, message?: string) => void;
    onDelete: (requestId: number) => void;
    updatingRequests: Record<number, boolean>;
    initialView: 'grid' | 'list';
};

export function AdoptionRequestList({ requests, onUpdate, onDelete, updatingRequests, initialView }: AdoptionRequestListProps) {
    
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
        <>
            {initialView === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {requests.map((request) => (
                        <AdoptionRequestCard
                            key={request.id}
                            request={request}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            isUpdating={updatingRequests[request.id] ?? false}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <AdoptionRequestListItem
                            key={request.id}
                            request={request}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            isUpdating={updatingRequests[request.id] ?? false}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
