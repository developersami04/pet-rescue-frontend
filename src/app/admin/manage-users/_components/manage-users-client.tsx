
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getRegisteredUsers, updateUserStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { RegisteredUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Loader2, Table } from 'lucide-react';
import { UserCard } from './user-card';
import { UserListItem } from './user-list-item';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHeader } from '@/components/page-header';
import { UserTable } from './user-table';


function UsersSkeleton({ view }: { view: 'grid' | 'list' | 'table' }) {
    const CardSkeleton = () => (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[350px] w-full rounded-lg" />
        </div>
    );

    const ListSkeleton = () => (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
        </div>
    );

     const TableSkeleton = () => (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-1/4" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
             <div className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-48" />
            </div>
        </div>
    );
    
    if (view === 'table') {
        return <TableSkeleton />;
    }

    return (
        view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
        ) : (
            <div className="space-y-4">
                 {[...Array(8)].map((_, i) => <ListSkeleton key={i} />)}
            </div>
        )
    );
}

export function ManageUsersClient() {
    const [users, setUsers] = useState<RegisteredUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'grid' | 'list' | 'table'>('table');
    const [updatingUsers, setUpdatingUsers] = useState<Record<number, boolean>>({});
    const router = useRouter();
    const { toast } = useToast();

    const fetchUsers = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to manage users.');
            setIsLoading(false);
            return;
        }

        try {
            const usersData = await getRegisteredUsers(token);
            setUsers(usersData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch users.');
                toast({ variant: 'destructive', title: 'Failed to fetch users' });
            }
        }
    }, [toast, router]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUsers();
        setIsRefreshing(false);
    }

    const handleUpdateUser = useCallback(async (userId: number, field: 'is_verified' | 'is_active' | 'is_staff', value: boolean) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            return;
        }

        setUpdatingUsers(prev => ({ ...prev, [userId]: true }));

        try {
            await updateUserStatus(token, userId, field, value);
            toast({ title: 'User Updated', description: 'The user status has been successfully updated.' });
            
            // Optimistically update UI or refetch
            setUsers(prevUsers => 
                prevUsers.map(u => u.id === userId ? { ...u, [field]: value } : u)
            );

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
        } finally {
            setUpdatingUsers(prev => ({ ...prev, [userId]: false }));
        }
    }, [toast]);

    useEffect(() => {
        setIsLoading(true);
        fetchUsers().finally(() => setIsLoading(false));
    }, [fetchUsers]);
    
    if (error) {
        return (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="mt-6">
            <div className="sticky top-16 z-40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between gap-4">
                    <PageHeader
                        title="Manage Users"
                        description="View and manage all registered users in the system."
                        className="pb-0"
                    />
                    <div className="flex items-center gap-2">
                        <Button onClick={handleRefresh} disabled={isRefreshing || isLoading} variant="outline">
                            {(isRefreshing || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Refresh
                        </Button>
                        <div className="flex items-center gap-1 rounded-md border p-1">
                            <Button
                                variant={view === 'grid' ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => setView('grid')}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </Button>
                            <Button
                                variant={view === 'list' ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => setView('list')}
                                aria-label="List view"
                            >
                                <List className="h-5 w-5" />
                            </Button>
                            <Button
                                variant={view === 'table' ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => setView('table')}
                                aria-label="Table view"
                            >
                                <Table className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {isLoading ? (
                    <UsersSkeleton view={view} />
                ) : view === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {users.map((user) => (
                            <UserCard 
                                key={user.id} 
                                user={user} 
                                onUpdate={handleUpdateUser}
                                isUpdating={updatingUsers[user.id]}
                            />
                        ))}
                    </div>
                ) : view === 'list' ? (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <UserListItem 
                                key={user.id} 
                                user={user} 
                                onUpdate={handleUpdateUser}
                                isUpdating={updatingUsers[user.id]}
                            />
                        ))}
                    </div>
                ) : (
                    <UserTable 
                        data={users} 
                        onUpdate={handleUpdateUser}
                        updatingUsers={updatingUsers}
                    />
                )}
            </div>
        </div>
    );
}
