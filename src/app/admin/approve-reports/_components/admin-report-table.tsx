
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, Loader2, MoreVertical, ShieldCheck, ThumbsDown, X } from 'lucide-react';
import type { AdminPetReport } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PetTypeIcon } from '@/components/pet-icons';
import Link from 'next/link';

type ReportStatus = 'approved' | 'rejected' | 'resolved';

type AdminReportTableProps = {
  data: AdminPetReport[];
  onUpdateReport: (reportId: number, status: ReportStatus) => void;
  updatingReports: Record<number, boolean>;
};

export function AdminReportTable({ data, onUpdateReport, updatingReports }: AdminReportTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<AdminPetReport>[] = [
    {
        accessorKey: 'pet_name',
        header: 'Pet',
        cell: ({ row }) => {
            const report = row.original;
            const placeholder = getPlaceholderImage(report.pet_type_name);
            const imageUrl = report.image || placeholder.url;
            return (
                 <Link href={`/pets/${report.pet_id}`} className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={imageUrl} alt={report.pet_name} className="object-cover" />
                        <AvatarFallback>{report.pet_name?.[0] ?? 'P'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold group-hover:underline">{report.pet_name}</p>
                        <p className="text-sm text-muted-foreground">{report.pet_type_name}</p>
                    </div>
                </Link>
            )
        }
    },
    {
        accessorKey: 'created_by_username',
        header: 'Reporter',
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const report = row.original;
            const petStatus = report.pet_status;

            return (
                <div className="flex flex-wrap gap-1">
                    <Badge 
                        className={cn("capitalize", 
                            report.report_status === 'pending' ? 'bg-amber-500 text-white' : 
                            report.report_status === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        )}
                        >
                            {report.report_status}
                        </Badge>
                     {petStatus && (
                        <Badge 
                            className={cn("capitalize", 
                                petStatus === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 
                                petStatus === 'found' ? 'bg-blue-500 text-white' :
                                'bg-green-500 text-white'
                            )}
                            >
                                {petStatus}
                        </Badge>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: 'created_at',
        header: 'Reported On',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return format(date, 'MMM d, yyyy');
        }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const report = row.original;
        const isUpdating = updatingReports[report.id];

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateReport(report.id, 'approved')} disabled={report.report_status === 'approved'}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Approve</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onUpdateReport(report.id, 'rejected')} disabled={report.report_status === 'rejected'}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    <span>Reject</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateReport(report.id, 'resolved')}>
                    <X className="mr-2 h-4 w-4" />
                    <span>Resolve</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by pet name..."
          value={(table.getColumn('pet_name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('pet_name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{' '}
          {data.length} report(s) found.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
