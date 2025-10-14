
'use client';

import { AdminPetReport } from "@/lib/data";
import { PawPrint, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminReportCard } from "./admin-report-card";
import { AdminReportListItem } from "./admin-report-list-item";

type ReportStatus = 'approved' | 'rejected' | 'resolved';

type AdminReportListProps = {
    reports: AdminPetReport[];
    onUpdateReport: (reportId: number, status: ReportStatus) => void;
    updatingReports: Record<number, boolean>;
};

export function AdminReportList({ reports, onUpdateReport, updatingReports }: AdminReportListProps) {
    const [view, setView] = useState('grid');
    
    if (reports.length === 0) {
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
                <div className="flex items-center gap-1 rounded-md border p-1">
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
                    {reports.map((report) => (
                        <AdminReportCard 
                            key={report.id} 
                            report={report} 
                            onUpdate={onUpdateReport}
                            isUpdating={updatingReports[report.id]}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <AdminReportListItem 
                            key={report.id} 
                            report={report} 
                            onUpdate={onUpdateReport}
                            isUpdating={updatingReports[report.id]}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
