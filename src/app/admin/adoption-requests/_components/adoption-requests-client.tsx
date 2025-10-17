
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { getAdminAdoptionRequests, updateAdoptionRequestStatus, deleteAdminAdoptionRequest } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdoptionRequest } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Loader2, Table } from 'lucide-react';
import { AdoptionRequestsTabs } from './adoption-requests-tabs';
import { AdoptionRequestList } from './adoption-request-list';
import { PageHeader } from '@/components/page-header';
import { AdoptionRequestTable } from './adoption-request-table';

type TabValue = 'pending' | 'recents' | 'rejected';
type RequestStatus = 'approved' | 'rejected';

function RequestsSkeleton({ view }: { view: 'grid' | 'list' | 'table' }) {
    const CardSkeleton = () => (
         <div className="flex flex-col space-y-3">
            <Skeleton className="h-56 w-full rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
    const ListSkeleton = () => <Skeleton className="h-28 w-full" />;
    const TableSkeleton = () => (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-96 w-full rounded-lg" />
        </div>
    );

    if (view === 'table') return <TableSkeleton />;
    
    const items = view === 'grid' 
        ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
        : Array.from({ length: 5 }).map((_, i) => <ListSkeleton key={i} />);
    
    const containerClass = view === 'grid'
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        : "space-y-4";
    
    return <div className={containerClass}>{items}</div>;
}


function AdoptionRequestsClientContent() {
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingRequests, setUpdatingRequests] = useState<Record<number, boolean>>({});
    const [view, setView] = useState<'grid' | 'list' | 'table'>('grid');
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState<TabValue>(
        tabFromUrl === 'recents' || tabFromUrl === 'rejected' ? tabFromUrl : 'pending'
    );
    const { toast } = useToast();

    useEffect(() => {
        const newTab = searchParams.get('tab');
        if (newTab === 'pending' || newTab === 'recents' || newTab === 'rejected') {
            setActiveTab(newTab);
        }
    }, [searchParams]);

    const fetchRequests = useCallback(async (tab: TabValue, isRefresh = false) => {
        if (!isRefresh) {
            setIsLoading(true);
        }
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to view requests.');
            setIsLoading(false);
            return;
        }

        try {
            let status: 'pending' | 'rejected' | 'recents' | undefined = undefined;
             if (tab === 'pending') status = 'pending';
             if (tab === 'rejected') status = 'rejected';
             if (tab === 'recents') status = 'recents';

            const requestsData = await getAdminAdoptionRequests(token, status);
            setRequests(requestsData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch adoption requests.');
                toast({ variant: 'destructive', title: 'Failed to fetch requests' });
            }
        } finally {
            if (!isRefresh) {
                setIsLoading(false);
            }
        }
    }, [toast, router]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchRequests(activeTab, true);
        setIsRefreshing(false);
    }
    
    const handleUpdateRequest = useCallback(async (requestId: number, status: RequestStatus, message?: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            return;
        }

        setUpdatingRequests(prev => ({ ...prev, [requestId]: true }));

        try {
            await updateAdoptionRequestStatus(token, requestId, status, message);
            toast({ title: 'Request Updated', description: `The request has been successfully ${status}.` });
            
            // Optimistically remove the request from the list if it's pending
            if (activeTab === 'pending') {
                setRequests(prevRequests => 
                    prevRequests.filter(r => r.id !== requestId)
                );
            } else {
                // otherwise, just refresh data for other tabs
                await fetchRequests(activeTab, true);
            }

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
        } finally {
            setUpdatingRequests(prev => ({ ...prev, [requestId]: false }));
        }
    }, [toast, activeTab, fetchRequests]);

    const handleDeleteRequest = useCallback(async (requestId: number) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            return;
        }

        setUpdatingRequests(prev => ({ ...prev, [requestId]: true }));

        try {
            await deleteAdminAdoptionRequest(token, requestId);
            toast({ title: 'Request Deleted', description: `The request has been successfully deleted.` });
            setRequests(prevRequests => 
                prevRequests.filter(r => r.id !== requestId)
            );
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message });
        } finally {
            setUpdatingRequests(prev => ({ ...prev, [requestId]: false }));
        }
    }, [toast]);


    useEffect(() => {
        fetchRequests(activeTab);
    }, [activeTab, fetchRequests]);

    const handleTabChange = (tab: TabValue) => {
        setActiveTab(tab);
        router.push(`/admin/adoption-requests?tab=${tab}`, { scroll: false });
    };

    const renderContent = () => {
        if (isLoading) {
            return <RequestsSkeleton view={view} />;
        }
        if (error) {
            return (
                <Alert variant="destructive" className="mt-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }
        if (view === 'table') {
            return <AdoptionRequestTable data={requests} onUpdate={handleUpdateRequest} onDelete={handleDeleteRequest} updatingRequests={updatingRequests} />;
        }
        return <AdoptionRequestList requests={requests} onUpdate={handleUpdateRequest} onDelete={handleDeleteRequest} updatingRequests={updatingRequests} initialView={view} />;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                 <PageHeader
                    title="Manage Adoption Requests"
                    description="Review and approve adoption requests from users."
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
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as any)} className="w-full">
                <AdoptionRequestsTabs activeTab={activeTab} onTabChange={handleTabChange} />
                <div className="mt-6">
                    {renderContent()}
                </div>
            </Tabs>
        </>
    );
}

export function AdoptionRequestsClient() {
    return (
        <Suspense fallback={<RequestsSkeleton view="grid" />}>
            <AdoptionRequestsClientContent />
        </Suspense>
    )
}
