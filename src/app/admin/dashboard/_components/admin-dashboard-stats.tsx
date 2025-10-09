
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, PawPrint, FileText, Handshake, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatDetailsDialog } from "./admin-stat-details-dialog";
import { Button } from "@/components/ui/button";

export type UserMetrics = {
    total: number;
    active: number;
    inactive: number;
    verified: number;
    unverified: number;
    staff: number;
    non_staff: number;
};

export type PetMetrics = {
    total: number;
    current: number;
    deleted: number;
    verified: number;
    unverified: number;
};

export type ReportMetrics = {
    total: number;
    found: number;
    adoptable: number;
    lost: number;
    pending: number;
    approved: number;
    resolved: number;
    rejected: number;
};

export type AdoptionMetrics = {
    total: number;
    pending_from_admin: number;
    approved_from_admin: number;
    rejected_from_admin: number;
    successful: number;
    rejected_by_user: number;
};

export type Metrics = {
    users: UserMetrics;
    pets: PetMetrics;
    reports: ReportMetrics;
    adoptions: AdoptionMetrics;
};

type AdminDashboardStatsProps = {
    metrics: Metrics | null;
    isLoading: boolean;
};

function StatCard({ title, value, icon, isLoading, details, detailsTitle }: { title: string, value: number, icon: React.ReactNode, isLoading: boolean, details?: any, detailsTitle?: string }) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className="text-muted-foreground">{icon}</div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                </CardContent>
            </Card>
        )
    }

    const cardContent = (
         <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
            {details && (
                <CardFooter className="p-2 pt-0 border-t mt-auto">
                    <AdminStatDetailsDialog
                        trigger={
                            <Button variant="ghost" size="sm" className="w-full">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Button>
                        }
                        title={detailsTitle || `Details for ${title}`}
                        data={details}
                    />
                </CardFooter>
            )}
        </Card>
    );

    return cardContent;
}

export function AdminDashboardStats({ metrics, isLoading }: AdminDashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <StatCard 
                title="Total Users" 
                value={metrics?.users?.total ?? 0}
                icon={<Users className="h-6 w-6" />}
                isLoading={isLoading}
                detailsTitle="User Statistics"
                details={metrics?.users}
             />
             <StatCard 
                title="Total Pets" 
                value={metrics?.pets?.total ?? 0}
                icon={<PawPrint className="h-6 w-6" />}
                isLoading={isLoading}
                detailsTitle="Pet Statistics"
                details={metrics?.pets}
             />
             <StatCard 
                title="Total Reports" 
                value={metrics?.reports?.total ?? 0}
                icon={<FileText className="h-6 w-6" />}
                isLoading={isLoading}
                detailsTitle="Report Statistics"
                details={metrics?.reports}
             />
             <StatCard 
                title="Total Adoptions" 
                value={metrics?.adoptions?.total ?? 0}
                icon={<Handshake className="h-6 w-6" />}
                isLoading={isLoading}
                detailsTitle="Adoption Statistics"
                details={metrics?.adoptions}
             />
        </div>
    );
}
