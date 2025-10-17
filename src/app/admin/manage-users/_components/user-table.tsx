
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
import { Award, BadgeCheck, Loader2, MoreVertical, User, UserCheck, UserCog, UserX, XCircle } from 'lucide-react';
import { RegisteredUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getRandomDefaultProfileImage } from '@/lib/page-data/user-data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type UserTableProps = {
  data: RegisteredUser[];
  onUpdate: (userId: number, field: 'is_verified' | 'is_active' | 'is_staff', value: boolean) => void;
  updatingUsers: Record<number, boolean>;
};

export function UserTable({ data, onUpdate, updatingUsers }: UserTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<RegisteredUser>[] = [
    {
        accessorKey: 'username',
        header: 'User',
        cell: ({ row }) => {
            const user = row.original;
            const fullName = `${user.first_name} ${user.last_name}`;
            const avatarFallback = (user.first_name?.[0] ?? '') + (user.last_name?.[0] ?? '');
            const defaultImage = getRandomDefaultProfileImage(user.username);
            return (
                 <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profile_image ?? defaultImage} alt={fullName} />
                        <AvatarFallback>{avatarFallback || user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold">{fullName}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                </div>
            )
        }
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
        accessorKey: 'date_joined',
        header: 'Joined',
        cell: ({ row }) => {
            const date = new Date(row.original.date_joined);
            return format(date, 'MMM d, yyyy');
        }
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex flex-wrap gap-1">
                    <Badge variant={user.is_verified ? 'default' : 'secondary'} className="gap-1">
                        {user.is_verified ? <BadgeCheck className="h-3 w-3"/> : <XCircle className="h-3 w-3" />}
                        {user.is_verified ? 'Verified' : 'Not Verified'}
                    </Badge>
                    <Badge variant={user.is_active ? 'default' : 'destructive'} className="gap-1">
                         {user.is_active ? <BadgeCheck className="h-3 w-3"/> : <XCircle className="h-3 w-3" />}
                        {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                     <Badge variant={user.is_staff ? 'default' : 'secondary'} className="gap-1">
                        {user.is_staff ? <Award className="h-3 w-3"/> : <User className="h-3 w-3" />}
                        {user.is_staff ? 'Staff' : 'User'}
                    </Badge>
                </div>
            )
        }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        const isUpdating = updatingUsers[user.id];

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdate(user.id, 'is_verified', !user.is_verified)}>
                    {user.is_verified ? <XCircle className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                    <span>{user.is_verified ? 'Unverify' : 'Verify'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(user.id, 'is_active', !user.is_active)}>
                    {user.is_active ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                    <span>{user.is_active ? 'Deactivate' : 'Activate'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(user.id, 'is_staff', !user.is_staff)}>
                    {user.is_staff ? <User className="mr-2 h-4 w-4" /> : <UserCog className="mr-2 h-4 w-4" />}
                    <span>{user.is_staff ? 'Make User' : 'Make Staff'}</span>
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
          placeholder="Filter by email or username..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('email')?.setFilterValue(event.target.value)
            table.getColumn('username')?.setFilterValue(event.target.value)
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
                  className={cn(row.original.is_staff && "bg-primary/5")}
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
          {data.length} user(s).
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
