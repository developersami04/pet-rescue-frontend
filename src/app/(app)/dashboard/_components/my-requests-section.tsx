
'use client';

import { Card } from "@/components/ui/card";
import { FileText, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { MyAdoptionRequest } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AdoptionRequestListItem } from "./adoption-request-list-item";
import { AdoptionRequestCard } from "./adoption-request-card";

type MyRequestsSectionProps = {
    requests: MyAdoptionRequest[];
    onUpdate: () => void;
}

export function MyRequestsSection({ requests, onUpdate }: MyRequestsSectionProps) {
    const [view, setView] = useState('grid');
    
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
                    {requests.map(req => (
                        <AdoptionRequestCard key={req.id} request={req} onUpdate={onUpdate} />
                    ))}
                </div>
             ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <AdoptionRequestListItem key={req.id} request={req} onUpdate={onUpdate} />
                    ))}
                </div>
             )}
        </>
    );
}
