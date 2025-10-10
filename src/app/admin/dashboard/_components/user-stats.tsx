
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserMetrics } from "./admin-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, ShieldCheck, ShieldAlert } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

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

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-lg shadow-sm">
        <p className="label font-bold">{`${label}`}</p>
        {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.fill }}>{`${pld.name}: ${pld.value}`}</p>
        ))}
      </div>
    );
  }

  return null;
}

export function UserStats({ metrics, isLoading }: { metrics: UserMetrics | null, isLoading: boolean }) {
    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        )
    }

    const chartData = [
        { name: 'Activity', active: metrics?.active ?? 0, inactive: metrics?.inactive ?? 0 },
        { name: 'Verification', verified: metrics?.verified ?? 0, unverified: metrics?.unverified ?? 0 },
        { name: 'Roles', staff: metrics?.staff ?? 0, non_staff: metrics?.non_staff ?? 0 },
    ];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>A detailed breakdown of registered users.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                 <div className="space-y-4">
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
                </div>
                 <ChartContainer config={{}} className="h-[250px] w-full">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                        <Legend />
                        <Bar dataKey="active" name="Active" fill="hsl(var(--chart-2))" stackId="a" />
                        <Bar dataKey="inactive" name="Inactive" fill="hsl(var(--chart-5))" stackId="a" />
                        <Bar dataKey="verified" name="Verified" fill="hsl(var(--chart-1))" stackId="b" />
                        <Bar dataKey="unverified" name="Unverified" fill="hsl(var(--chart-4))" stackId="b" />
                        <Bar dataKey="staff" name="Staff" fill="hsl(var(--chart-3))" stackId="c" />
                        <Bar dataKey="non_staff" name="Non-Staff" fill="hsl(var(--chart-5))" stackId="c" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
