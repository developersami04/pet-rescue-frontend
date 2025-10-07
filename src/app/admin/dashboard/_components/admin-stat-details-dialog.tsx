
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

type AdminStatDetailsDialogProps = {
    trigger: React.ReactNode;
    title: string;
    data: Record<string, number>;
};

export function AdminStatDetailsDialog({ trigger, title, data }: AdminStatDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
          <div className="cursor-pointer">
            {trigger}
          </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            A detailed breakdown of the selected metric.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
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
                            <TableCell className="font-medium">{key}</TableCell>
                            <TableCell className="text-right">{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
