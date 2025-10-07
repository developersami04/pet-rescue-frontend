
'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { getAdminPetReports, updatePetReportStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminPetReport } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AdminReportTabs } from './admin-report-tabs';
import { AdminReportList } from './admin-report-list';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type TabValue = 'pending' | 'last50' | 'rejected';
type ReportStatus = 'approved' | 'rejected' | 'resolved';

function ReportsSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                     <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-56 w-full rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminReportsClientContent() {
    const [reports, setReports] = useState<AdminPetReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingReports, setUpdatingReports] = useState<Record<number, boolean>>({});
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState<TabValue>(
        tabFromUrl === 'last50' || tabFromUrl === 'rejected' ? tabFromUrl : 'pending'
    );
    const { toast } = useToast();

    useEffect(() => {
        const newTab = searchParams.get('tab');
        if (newTab === 'pending' || newTab === 'last50' || newTab === 'rejected') {
            setActiveTab(newTab);
        }
    }, [searchParams]);

    const fetchReports = useCallback(async (tab: TabValue, isRefresh = false) => {
        if (!isRefresh) {
            setIsLoading(true);
        }
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to view reports.');
            setIsLoading(false);
            return;
        }

        try {
            let status: 'pending' | 'rejected' | 'last50' | undefined = undefined;
             if (tab === 'pending') status = 'pending';
             if (tab === 'rejected') status = 'rejected';
             if (tab === 'last50') status = 'last50';

            const reportsData = await getAdminPetReports(token, status);
            setReports(reportsData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch pet reports.');
                toast({ variant: 'destructive', title: 'Failed to fetch reports' });
            }
        } finally {
            if (!isRefresh) {
                setIsLoading(false);
            }
        }
    }, [toast, router]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchReports(activeTab, true);
        setIsRefreshing(false);
    }
    
    const handleUpdateReport = useCallback(async (reportId: number, status: ReportStatus) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            return;
        }

        setUpdatingReports(prev => ({ ...prev, [reportId]: true }));

        try {
            await updatePetReportStatus(token, reportId, status);
            toast({ title: 'Report Updated', description: `The report has been successfully ${status}.` });
            
            // Optimistically remove the report from the list
            setReports(prevReports => 
                prevReports.filter(r => r.id !== reportId)
            );

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
        } finally {
            setUpdatingReports(prev => ({ ...prev, [reportId]: false }));
        }
    }, [toast]);


    useEffect(() => {
        fetchReports(activeTab);
    }, [activeTab, fetchReports]);

    const filteredReports = useMemo(() => {
        // The API now handles filtering by status, so we can just display the results.
        // The `last50` case in the previous implementation which sliced the array is now handled by the API.
        return reports;
    }, [reports]);

    const handleTabChange = (tab: TabValue) => {
        setActiveTab(tab);
        router.push(`/admin/approve-reports?tab=${tab}`, { scroll: false });
    };

    if (isLoading) {
        return <ReportsSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <PageHeader
                    title="Approve Reports"
                    description="Review and approve pet reports from users."
                    className="pb-0"
                />
                <Button onClick={handleRefresh} disabled={isRefreshing}>
                    {isRefreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Refresh
                </Button>
            </div>
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as any)} className="w-full">
                <AdminReportTabs activeTab={activeTab} onTabChange={handleTabChange} />
                <div className="mt-6">
                    <TabsContent value="pending">
                        <AdminReportList reports={filteredReports} onUpdateReport={handleUpdateReport} updatingReports={updatingReports} />
                    </TabsContent>
                    <TabsContent value="last50">
                        <AdminReportList reports={filteredReports} onUpdateReport={handleUpdateReport} updatingReports={updatingReports} />
                    </TabsContent>
                    <TabsContent value="rejected">
                        <AdminReportList reports={filteredReports} onUpdateReport={handleUpdateReport} updatingReports={updatingReports} />
                    </TabsContent>
                </div>
            </Tabs>
        </>
    );
}

export function AdminReportsClient() {
    return (
        <Suspense fallback={<ReportsSkeleton />}>
            <AdminReportsClientContent />
        </Suspense>
    )
}
