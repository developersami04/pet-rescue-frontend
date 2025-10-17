
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
import { BadgeCheck, Loader2, MoreVertical, Trash2 } from 'lucide-react';
import { Pet } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PetTypeIcon } from '@/components/pet-icons';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type AdminPetTableProps = {
  data: Pet[];
  onDelete: (petId: number) => void;
  deletingPets: Record<number, boolean>;
};

export function AdminPetTable({ data, onDelete, deletingPets }: AdminPetTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Pet>[] = [
    {
        accessorKey: 'name',
        header: 'Pet',
        cell: ({ row }) => {
            const pet = row.original;
            const placeholder = getPlaceholderImage(pet.type_name);
            const imageUrl = pet.pet_image || placeholder.url;
            return (
                 <Link href={`/pets/${pet.id}`} className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={imageUrl} alt={pet.name} className="object-cover" />
                        <AvatarFallback>{pet.name?.[0] ?? 'P'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold group-hover:underline">{pet.name}</p>
                        <p className="text-sm text-muted-foreground">{pet.breed || pet.type_name}</p>
                    </div>
                </Link>
            )
        }
    },
    {
      accessorKey: 'type_name',
      header: 'Type',
      cell: ({ row }) => {
          const pet = row.original;
          return (
              <div className="flex items-center gap-2">
                <PetTypeIcon typeName={pet.type_name} className="h-4 w-4" />
                <span>{pet.type_name}</span>
              </div>
          )
      }
    },
    {
        accessorKey: 'age',
        header: 'Age',
        cell: ({ row }) => {
            const age = row.original.age;
            return age ? `${age} yr(s)` : 'N/A';
        }
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const pet = row.original;
            const petStatus = pet.pet_report?.pet_status;
            const isResolved = pet.pet_report?.is_resolved;

            const getStatusInfo = (status: string | undefined | null) => {
                if (!status || isResolved) return null;
                switch (status) {
                    case 'lost': return { text: 'Lost', className: 'bg-destructive/90 text-destructive-foreground' };
                    case 'found': return { text: 'Found', className: 'bg-blue-500 text-white' };
                    case 'adopt': return { text: 'Adoptable', className: 'bg-green-500 text-white' };
                    default: return null;
                }
            };
            const statusInfo = getStatusInfo(petStatus);

            return (
                <div className="flex flex-wrap gap-1">
                    <Badge variant={pet.is_verified ? 'default' : 'secondary'} className="gap-1">
                        {pet.is_verified ? <BadgeCheck className="h-3 w-3"/> : null}
                        {pet.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                     {statusInfo && (
                        <Badge className={cn("capitalize", statusInfo.className)}>
                            {statusInfo.text}
                        </Badge>
                    )}
                </div>
            )
        }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const pet = row.original;
        const isDeleting = deletingPets[pet.id];

        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting}>
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
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
                          This action cannot be undone. This will permanently delete {pet.name}.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(pet.id)} disabled={isDeleting}>
                          Continue
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name, type, or breed..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            const filterValue = event.target.value;
            table.getColumn('name')?.setFilterValue(filterValue)
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
          {data.length} pet(s) found.
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
