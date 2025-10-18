

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
import { Loader2, MoreVertical, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { AdoptionRequest } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getRandomDefaultProfileImage } from '@/lib/page-data/user-data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { NotifyUserDialog } from './notify-user-dialog';
import { UserDetailsDialog } from '@/components/user-details-dialog';

type RequestStatus = 'approved' | 'rejected';

type AdoptionRequestTableProps = {
  data: AdoptionRequest[];
  onUpdate: (requestId: number, status: RequestStatus, message?: string) => void;
  onDelete: (requestId: number) => void;
  updatingRequests: Record<number, boolean>;
};

export function AdoptionRequestTable({ data, onUpdate, onDelete, updatingRequests }: AdoptionRequestTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<AdoptionRequest>[] = [
    {
        accessorKey: 'pet_name',
        header: 'Pet',
        cell: ({ row }) => {
            const request = row.original;
            const petImageUrl = request.pet_image || `https://picsum.photos/seed/${request.pet}/100/100`;
            return (
                 <Link href={`/pets/${request.pet_id}`} className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={petImageUrl} alt={request.pet_name} className="object-cover" />
                        <AvatarFallback>{request.pet_name?.[0] ?? 'P'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold group-hover:underline">{request.pet_name}</p>
                        <p className="text-sm text-muted-foreground">Owner: {request.owner_name}</p>
                    </div>
                </Link>
            )
        }
    },
    {
      accessorKey: 'requester_name',
      header: 'Requester',
      cell: ({ row }) => {
            const request = row.original;
            const defaultRequesterImage = getRandomDefaultProfileImage(request.requester_name);
            const requesterImageUrl = request.requester_profile_image || defaultRequesterImage;
            return (
                <UserDetailsDialog userId={request.requester_id}>
                     <div className="flex items-center gap-3 group cursor-pointer">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={requesterImageUrl} alt={request.requester_name} className="object-cover" />
                            <AvatarFallback>{request.requester_name?.[0] ?? 'U'}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium group-hover:underline">{request.requester_name}</p>
                    </div>
                </UserDetailsDialog>
            )
      }
    },
    {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ row }) => {
            const message = row.original.message;
            return <p className="line-clamp-2" title={message}>"{message}"</p>
        }
    },
    {
        accessorKey: 'created_at',
        header: 'Requested On',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return format(date, 'MMM d, yyyy');
        }
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const request = row.original;
            const getStatusVariant = (status: string | undefined | null) => {
                switch (status?.toLowerCase()) {
                    case 'approved': return 'default';
                    case 'rejected': return 'destructive';
                    case 'pending': default: return 'secondary';
                }
            };
            return (
                <Badge variant={getStatusVariant(request.report_status)} className="capitalize">
                    {request.report_status || 'pending'}
                </Badge>
            )
        }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const request = row.original;
        const isUpdating = updatingRequests[request.id];
        const isPending = request.report_status === 'pending';

        return (
            <div className="flex items-center gap-1">
                {isPending && (
                    <>
                    <NotifyUserDialog
                        action="rejected"
                        request={request}
                        onConfirm={(message) => onUpdate(request.id, 'rejected', message)}
                        isUpdating={isUpdating}
                    >
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={isUpdating}>
                            <ThumbsDown className="h-4 w-4" />
                        </Button>
                    </NotifyUserDialog>
                     <NotifyUserDialog
                        action="approved"
                        request={request}
                        onConfirm={(message) => onUpdate(request.id, 'approved', message)}
                        isUpdating={isUpdating}
                    >
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" disabled={isUpdating}>
                            <ThumbsUp className="h-4 w-4" />
                        </Button>
                    </NotifyUserDialog>
                    </>
                )}
                 <AlertDialog>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this adoption request.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(request.id)} disabled={isUpdating}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
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
          placeholder="Filter by pet or requester name..."
          value={(table.getColumn('pet_name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            const filterValue = event.target.value;
            table.getColumn('pet_name')?.setFilterValue(filterValue);
            table.getColumn('requester_name')?.setFilterValue(filterValue);
          }}
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
          {data.length} request(s) found.
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
