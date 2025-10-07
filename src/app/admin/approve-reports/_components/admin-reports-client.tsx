
'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { getPetReports } from '@/lib/actions';
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

    const fetchReports = useCallback(async (tab: TabValue) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to view reports.');
            setIsLoading(false);
            return;
        }

        try {
            let status: 'pending' | 'approved' | 'rejected' | 'all' = 'pending';
             if (tab === 'rejected') status = 'rejected';
             // The API doesn't seem to support 'last50' or 'approved' directly,
             // so we'll fetch all and filter for now.
             // This can be optimized if the API adds more filtering capabilities.
             if (tab === 'last50') status = 'all';


            const reportsData = await getPetReports(token, status);
            setReports(reportsData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch pet reports.');
                toast({ variant: 'destructive', title: 'Failed to fetch reports' });
            }
        }
    }, [toast, router]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchReports(activeTab);
        setIsRefreshing(false);
    }

    useEffect(() => {
        setIsLoading(true);
        fetchReports(activeTab).finally(() => setIsLoading(false));
    }, [activeTab, fetchReports]);

    const filteredReports = useMemo(() => {
        // The API is already filtering by status for 'pending' and 'rejected'.
        // For 'last50', we sort by date and take the first 50.
        if (activeTab === 'last50') {
            return reports
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 50);
        }
        return reports;
    }, [reports, activeTab]);

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
                        <AdminReportList reports={filteredReports} />
                    </TabsContent>
                    <TabsContent value="last50">
                        <AdminReportList reports={filteredReports} />
                    </TabsContent>
                    <TabsContent value="rejected">
                        <AdminReportList reports={filteredReports} />
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
