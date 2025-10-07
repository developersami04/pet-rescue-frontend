
'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { getAllPets } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pet } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AdminReportTabs } from './admin-report-tabs';
import { AdminReportList } from './admin-report-list';

type TabValue = 'pending' | 'last50' | 'rejected';

function ReportsSkeleton() {
    return (
        <div className="space-y-8">
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
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

    const fetchPets = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to view reports.');
            setIsLoading(false);
            return;
        }

        try {
            // Using getAllPets as a temporary endpoint
            const petsData = await getAllPets(token);
            setPets(petsData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch pet reports.');
                toast({ variant: 'destructive', title: 'Failed to fetch reports' });
            }
        } finally {
            setIsLoading(false);
        }
    }, [toast, router]);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    const filteredPets = useMemo(() => {
        // Placeholder filtering logic
        switch(activeTab) {
            case 'pending':
                return pets.filter(p => p.pet_report && !p.pet_report.is_resolved);
            case 'last50':
                return pets.slice(0, 50);
            case 'rejected':
                 // This is a placeholder, actual logic would depend on a 'rejected' status
                return pets.filter(p => p.id % 5 === 0);
            default:
                return pets;
        }
    }, [pets, activeTab]);

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
        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as any)} className="w-full mt-6">
            <AdminReportTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="mt-6">
                <TabsContent value="pending">
                    <AdminReportList pets={filteredPets} />
                </TabsContent>
                <TabsContent value="last50">
                    <AdminReportList pets={filteredPets} />
                </TabsContent>
                <TabsContent value="rejected">
                    <AdminReportList pets={filteredPets} />
                </TabsContent>
            </div>
        </Tabs>
    );
}

export function AdminReportsClient() {
    return (
        <Suspense fallback={<ReportsSkeleton />}>
            <AdminReportsClientContent />
        </Suspense>
    )
}
