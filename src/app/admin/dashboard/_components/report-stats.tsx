
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReportMetrics } from "./admin-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Search, AlertTriangle, Hand, Clock, Check, X, ShieldCheck } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, Tooltip, TooltipProps } from "recharts";
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";

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

type ChartData = {
    name: string;
    value: number;
    fill: string;
};


const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="p-2 bg-background border rounded-lg shadow-sm">
          <p className="label font-bold">{`${data.name}`}</p>
          <p style={{ color: data.color }}>{`Value: ${data.value}`}</p>
        </div>
      );
    }
    return null;
};


function PieChartComponent({ data, title }: { data: ChartData[], title: string }) {
    const chartConfig = useMemo(() => {
      const config: ChartConfig = {};
      data.forEach((entry) => {
        config[entry.name] = {
          label: entry.name,
          color: entry.fill,
        };
      });
      return config;
    }, [data]);
    
    return (
        <div className="flex flex-col items-center">
            <h4 className="text-center font-semibold mb-2">{title}</h4>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px] w-full">
                <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} strokeWidth={5}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
            </ChartContainer>
        </div>
    );
}

export function ReportStats({ metrics, isLoading }: { metrics: ReportMetrics | null, isLoading: boolean }) {
    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="space-y-4">
                         <Skeleton className="h-48 w-full" />
                         <Skeleton className="h-48 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const reportTypeData: ChartData[] = [
        { name: 'Lost', value: metrics?.lost ?? 0, fill: "hsl(var(--chart-5))" },
        { name: 'Found', value: metrics?.found ?? 0, fill: "hsl(var(--chart-1))" },
        { name: 'Adoptable', value: metrics?.adoptable ?? 0, fill: "hsl(var(--chart-2))" },
    ];

    const reportStatusData: ChartData[] = [
        { name: 'Pending', value: metrics?.pending ?? 0, fill: "hsl(var(--chart-4))" },
        { name: 'Approved', value: metrics?.approved ?? 0, fill: "hsl(var(--chart-2))" },
        { name: 'Resolved', value: metrics?.resolved ?? 0, fill: "hsl(var(--chart-1))" },
        { name: 'Rejected', value: metrics?.rejected ?? 0, fill: "hsl(var(--chart-5))" },
    ];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
                <CardDescription>A detailed breakdown of pet reports in the system.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                 <div className="space-y-4">
                     <StatItem
                        icon={FileText}
                        label="Total Reports"
                        value={metrics?.total ?? 0}
                    />
                    <Separator />
                    <p className="text-sm font-semibold text-muted-foreground">Report Types</p>
                    <div className="grid grid-cols-2 gap-4">
                        <StatItem icon={AlertTriangle} label="Lost" value={metrics?.lost ?? 0} colorClass="text-red-600" />
                        <StatItem icon={Search} label="Found" value={metrics?.found ?? 0} colorClass="text-blue-600" />
                        <StatItem icon={Hand} label="Adoptable" value={metrics?.adoptable ?? 0} colorClass="text-green-600" />
                    </div>
                    <Separator />
                    <p className="text-sm font-semibold text-muted-foreground">Report Statuses</p>
                    <div className="grid grid-cols-2 gap-4">
                        <StatItem icon={Clock} label="Pending" value={metrics?.pending ?? 0} colorClass="text-amber-600" />
                        <StatItem icon={ShieldCheck} label="Approved" value={metrics?.approved ?? 0} colorClass="text-green-600" />
                        <StatItem icon={Check} label="Resolved" value={metrics?.resolved ?? 0} colorClass="text-blue-600" />
                        <StatItem icon={X} label="Rejected" value={metrics?.rejected ?? 0} colorClass="text-red-600" />
                    </div>
                </div>
                 <div className="space-y-4 flex flex-col justify-around">
                    <PieChartComponent data={reportTypeData} title="Report Types" />
                    <PieChartComponent data={reportStatusData} title="Report Statuses" />
                </div>
            </CardContent>
        </Card>
    )
}
