'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserMetrics } from "./admin-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, ShieldCheck, ShieldAlert } from "lucide-react";

function StatItem({ icon, label, value, colorClass }: { icon: React.ElementType, label: string, value: number, colorClass?: string }) {
    const Icon = icon;
    return (
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-muted ${colorClass}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    )
}

export function UserStats({ metrics, isLoading }: { metrics: UserMetrics | null, isLoading: boolean }) {
    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>A detailed breakdown of registered users.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                <StatItem
                    icon={Users}
                    label="Total Users"
                    value={metrics?.total ?? 0}
                />
                 <StatItem
                    icon={UserCheck}
                    label="Active Users"
                    value={metrics?.active ?? 0}
                    colorClass="text-green-600"
                />
                <StatItem
                    icon={UserX}
                    label="Inactive Users"
                    value={metrics?.inactive ?? 0}
                    colorClass="text-red-600"
                />
                 <StatItem
                    icon={ShieldCheck}
                    label="Verified Users"
                    value={metrics?.verified ?? 0}
                    colorClass="text-blue-600"
                />
                 <StatItem
                    icon={ShieldAlert}
                    label="Unverified Users"
                    value={metrics?.unverified ?? 0}
                    colorClass="text-amber-600"
                />
                 <StatItem
                    icon={Users}
                    label="Staff Users"
                    value={metrics?.staff ?? 0}
                    colorClass="text-purple-600"
                />
            </CardContent>
        </Card>
    )
}
