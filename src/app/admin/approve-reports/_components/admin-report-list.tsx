
'use client';

import { Pet } from "@/lib/data";
import { PawPrint, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminReportCard } from "./admin-report-card";
import { AdminReportListItem } from "./admin-report-list-item";

type AdminReportListProps = {
    pets: Pet[];
};

export function AdminReportList({ pets }: AdminReportListProps) {
    const [view, setView] = useState('grid');
    
    if (pets.length === 0) {
        return (
            <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg">
                 <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No reports found</h3>
                <p className="text-muted-foreground mt-2">
                    There are currently no reports in this category.
                </p>
            </div>
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
                    {pets.map((pet) => (
                        <AdminReportCard key={pet.id} pet={pet} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {pets.map((pet) => (
                        <AdminReportListItem key={pet.id} pet={pet} />
                    ))}
                </div>
            )}
        </>
    )
}
