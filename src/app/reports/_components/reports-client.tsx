
'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { getPetReports } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { PetReport } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ReportTabs } from './report-tabs';
import { ReportPetList } from './report-pet-list';
import { LoginPromptDialog } from '@/components/login-prompt-dialog';
import { AnimatePresence, motion } from 'framer-motion';

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

function ReportsClientContent() {
    const [reports, setReports] = useState<PetReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'adopt'>(
        tabFromUrl === 'found' || tabFromUrl === 'adopt' ? tabFromUrl : 'lost'
    );

    useEffect(() => {
        const newTab = searchParams.get('tab');
        if (newTab === 'lost' || newTab === 'found' || newTab === 'adopt') {
            setActiveTab(newTab);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                setShowLoginPrompt(true);
                setIsLoading(false);
                return;
            }

            try {
                const reportsData = await getPetReports(token, activeTab);
                setReports(reportsData);
                setError(null);
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
        };

        fetchReports();
    }, [activeTab, toast, router]);


    const handleTabChange = (tab: 'lost' | 'found' | 'adopt') => {
        setActiveTab(tab);
        router.push(`/reports?tab=${tab}`, { scroll: false });
    };
    
    if (showLoginPrompt) {
        return <LoginPromptDialog isOpen={showLoginPrompt} />;
    }

    if (isLoading && reports.length === 0) {
        return <ReportsSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const renderContent = (status: 'lost' | 'found' | 'adopt') => {
        if (isLoading) {
            return <ReportsSkeleton />;
        }
        return <ReportPetList reports={reports} status={status} />;
    }

    return (
        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as any)} className="w-full">
            <ReportTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="mt-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent(activeTab)}
                    </motion.div>
                </AnimatePresence>
            </div>
        </Tabs>
    );
}

export function ReportsClient() {
    return (
        <Suspense fallback={<ReportsSkeleton />}>
            <ReportsClientContent />
        </Suspense>
    )
}
