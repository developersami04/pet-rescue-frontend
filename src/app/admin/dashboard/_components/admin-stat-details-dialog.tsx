
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, BarChart, XAxis, YAxis, Bar, CartesianGrid, Tooltip, Legend } from "recharts";
import { useMemo, useState } from "react";
import type { UserMetrics, PetMetrics, ReportMetrics, AdoptionMetrics } from "./admin-dashboard-stats";

type ChartData = {
    name: string;
    value: number;
};

type BarChartData = {
    name: string;
    [key: string]: number | string;
};

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"];

function isUserMetrics(data: any): data is UserMetrics {
    return 'active' in data && 'inactive' in data;
}

function isPetMetrics(data: any): data is PetMetrics {
    return 'current' in data && 'deleted' in data;
}

function isReportMetrics(data: any): data is ReportMetrics {
    return 'found' in data && 'lost' in data && 'approved' in data;
}

function isAdoptionMetrics(data: any): data is AdoptionMetrics {
    return 'pending_from_admin' in data && 'successful' in data;
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

function PieChartComponent({ data, title }: { data: ChartData[], title: string }) {
    const chartConfig = useMemo(() => {
      const config: ChartConfig = {};
      data.forEach((entry, index) => {
        config[entry.name] = {
          label: entry.name,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      });
      return config;
    }, [data]);
    
    return (
        <div>
            <h4 className="text-center font-semibold mb-2">{title}</h4>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px] w-full">
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} strokeWidth={5}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartConfig[entry.name].color} />
                        ))}
                    </Pie>
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
                 <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                    <Legend />
                    {bars.map(bar => (
                        <Bar key={bar.key} dataKey={bar.key} name={bar.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} fill={bar.color} stackId="a" />
                    ))}
                </BarChart>
            </ChartContainer>
        </div>
    );
}

function renderContent(data: any) {
    if (isUserMetrics(data)) {
        return (
            <div className="space-y-6">
                <BarChartComponent 
                    title="User Activity & Verification"
                    data={[
                        { name: 'Activity', active: data.active, inactive: data.inactive },
                        { name: 'Verification', verified: data.verified, unverified: data.unverified },
                        { name: 'Roles', staff: data.staff, non_staff: data.non_staff },
                    ]}
                    bars={[
                        { key: 'active', color: 'hsl(var(--chart-2))' },
                        { key: 'inactive', color: 'hsl(var(--chart-5))' },
                        { key: 'verified', color: 'hsl(var(--chart-1))' },
                        { key: 'unverified', color: 'hsl(var(--chart-4))' },
                        { key: 'staff', color: 'hsl(var(--chart-3))' },
                        { key: 'non_staff', color: 'hsl(var(--chart-5))' },
                    ]}
                />
            </div>
        );
    }
    if (isPetMetrics(data)) {
        return (
             <div className="space-y-6">
                <BarChartComponent 
                    title="Pet Status"
                    data={[
                        { name: 'Status', current: data.current, deleted: data.deleted },
                        { name: 'Verification', verified: data.verified, unverified: data.unverified },
                    ]}
                    bars={[
                        { key: 'current', color: 'hsl(var(--chart-2))' },
                        { key: 'deleted', color: 'hsl(var(--chart-5))' },
                        { key: 'verified', color: 'hsl(var(--chart-1))' },
                        { key: 'unverified', color: 'hsl(var(--chart-4))' },
                    ]}
                />
            </div>
        );
    }
    if (isReportMetrics(data)) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PieChartComponent 
                    title="Report Types"
                    data={[
                        { name: 'Found', value: data.found },
                        { name: 'Adoptable', value: data.adoptable },
                        { name: 'Lost', value: data.lost },
                    ]}
                />
                <PieChartComponent 
                    title="Report Status"
                    data={[
                        { name: 'Pending', value: data.pending },
                        { name: 'Approved', value: data.approved },
                        { name: 'Resolved', value: data.resolved },
                        { name: 'Rejected', value: data.rejected },
                    ]}
                />
            </div>
        );
    }
    if (isAdoptionMetrics(data)) {
        return (
            <div className="space-y-8">
                 <PieChartComponent 
                    title="Admin Approval Status"
                    data={[
                        { name: 'Pending', value: data.pending_from_admin },
                        { name: 'Approved', value: data.approved_from_admin },
                        { name: 'Rejected', value: data.rejected_from_admin },
                    ]}
                />
                <BarChartComponent
                    title="Final Adoption Outcome"
                    data={[
                        { name: 'Outcome', successful: data.successful, rejected_by_user: data.rejected_by_user }
                    ]}
                     bars={[
                        { key: 'successful', color: 'hsl(var(--chart-2))' },
                        { key: 'rejected_by_user', color: 'hsl(var(--chart-5))' },
                    ]}
                />
            </div>
        );
    }
    
    return <p className="text-muted-foreground">No detailed view available for this metric.</p>
}


type AdminStatDetailsDialogProps = {
    trigger: React.ReactNode;
    title: string;
    data: any;
};

export function AdminStatDetailsDialog({ trigger, title, data }: AdminStatDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
          {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            A detailed breakdown of the selected metric.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {data ? renderContent(data) : <p>No data available.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
