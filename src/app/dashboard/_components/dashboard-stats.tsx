
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, AlertTriangle, Search, FileText, Hand } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardStatsProps = {
    myPetsCount: number;
    lostPetsCount: number;
    foundPetsCount: number;
    adoptablePetsCount: number;
    myRequestsCount: number;
    isLoading: boolean;
}

function StatCard({ title, value, icon, isLoading }: { title: string, value: number, icon: React.ReactNode, isLoading: boolean }) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        <Skeleton className="h-4 w-3/4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export function DashboardStats({ 
    myPetsCount,
    lostPetsCount,
    foundPetsCount,
    adoptablePetsCount,
    myRequestsCount,
    isLoading 
}: DashboardStatsProps) {

    const stats = [
        { title: "My Pets", value: myPetsCount, icon: <PawPrint className="h-4 w-4" /> },
        { title: "Lost Pets", value: lostPetsCount, icon: <AlertTriangle className="h-4 w-4" /> },
        { title: "Found Pets", value: foundPetsCount, icon: <Search className="h-4 w-4" /> },
        { title: "Adoptable Pets", value: adoptablePetsCount, icon: <Hand className="h-4 w-4" /> },
        { title: "My Requests", value: myRequestsCount, icon: <FileText className="h-4 w-4" /> },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {stats.map(stat => (
                 <StatCard 
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    isLoading={isLoading}
                 />
            ))}
        </div>
    );
}
