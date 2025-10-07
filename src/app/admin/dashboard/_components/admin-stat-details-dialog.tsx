
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { useMemo } from "react";

type AdminStatDetailsDialogProps = {
    trigger: React.ReactNode;
    title: string;
    data: Record<string, number>;
};

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function AdminStatDetailsDialog({ trigger, title, data }: AdminStatDetailsDialogProps) {

  const chartData = useMemo(() => {
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value,
    }));
  }, [data]);
  
  const chartConfig = useMemo(() => {
      const config: ChartConfig = {};
      Object.keys(data).forEach((key, index) => {
        config[key] = {
          label: key,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      });
      return config;
    }, [data]);


  return (
    <Dialog>
      <DialogTrigger asChild>
          {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            A detailed breakdown of the selected metric.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(data).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell className="font-medium flex items-center">
                                <span className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: chartConfig[key].color }} />
                                {key}
                            </TableCell>
                            <TableCell className="text-right">{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
              <PieChart>
                 <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                    />
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartConfig[entry.name].color} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
