
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdoptionMetrics } from "./admin-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { Handshake, Clock, ThumbsUp, ThumbsDown, CheckCircle, XCircle } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, BarChart, XAxis, YAxis, Bar, CartesianGrid, Legend, Tooltip, TooltipProps } from "recharts";
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

type BarChartData = {
    name: string;
    [key: string]: number | string;
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

function BarChartComponent({ data, bars, title }: { data: BarChartData[], bars: { key: string, color: string }[], title: string }) {
    return (
        <div>
            <h4 className="text-center font-semibold mb-4">{title}</h4>
            <ChartContainer config={{}} className="h-[250px] w-full">
                 <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {bars.map(bar => (
                        <Bar key={bar.key} dataKey={bar.key} name={bar.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} fill={bar.color} />
                    ))}
                </BarChart>
            </ChartContainer>
        </div>
    );
}


export function AdoptionStats({ metrics, isLoading }: { metrics: AdoptionMetrics | null, isLoading: boolean }) {
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
                    </div>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        )
    }

    const adminApprovalData: ChartData[] = [
        { name: 'Pending', value: metrics?.pending_from_admin ?? 0, fill: "hsl(var(--chart-4))" },
        { name: 'Approved', value: metrics?.approved_from_admin ?? 0, fill: "hsl(var(--chart-2))" },
        { name: 'Rejected', value: metrics?.rejected_from_admin ?? 0, fill: "hsl(var(--chart-5))" },
    ];
    
    const finalOutcomeData: BarChartData[] = [
        { name: 'Outcome', successful: metrics?.successful ?? 0, rejected_by_user: metrics?.rejected_by_user ?? 0 }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adoption Statistics</CardTitle>
                <CardDescription>A breakdown of adoption requests and outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                 <div className="space-y-4">
                     <StatItem
                        icon={Handshake}
                        label="Total Adoptions"
                        value={metrics?.total ?? 0}
                    />
                    <Separator />
                     <p className="text-sm font-semibold text-muted-foreground">Admin Approval</p>
                    <div className="grid grid-cols-2 gap-4">
                        <StatItem icon={Clock} label="Pending" value={metrics?.pending_from_admin ?? 0} colorClass="text-amber-600" />
                        <StatItem icon={ThumbsUp} label="Approved" value={metrics?.approved_from_admin ?? 0} colorClass="text-green-600" />
                        <StatItem icon={ThumbsDown} label="Rejected" value={metrics?.rejected_from_admin ?? 0} colorClass="text-red-600" />
                    </div>
                    <Separator />
                    <p className="text-sm font-semibold text-muted-foreground">Final Outcome</p>
                     <div className="grid grid-cols-2 gap-4">
                        <StatItem icon={CheckCircle} label="Successful" value={metrics?.successful ?? 0} colorClass="text-blue-600" />
                        <StatItem icon={XCircle} label="Rejected by User" value={metrics?.rejected_by_user ?? 0} colorClass="text-purple-600" />
                    </div>
                </div>
                 <div className="space-y-4 flex flex-col justify-around">
                    <PieChartComponent data={adminApprovalData} title="Admin Approval Status" />
                    <BarChartComponent 
                        title="Final Adoption Outcome"
                        data={finalOutcomeData}
                        bars={[
                           { key: 'successful', color: 'hsl(var(--chart-1))' },
                           { key: 'rejected_by_user', color: 'hsl(var(--chart-3))' },
                        ]}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
