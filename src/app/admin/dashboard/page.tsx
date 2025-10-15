
'use client';

import { PageHeader } from "@/components/page-header";
import { AdminDashboardStats, type Metrics } from "./_components/admin-dashboard-stats";
import { Suspense, useState, useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getAdminDashboardMetrics } from "@/lib/actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserStats } from "./_components/user-stats";
import { PetStats } from "./_components/pet-stats";
import { ReportStats } from "./_components/report-stats";
import { AdoptionStats } from "./_components/adoption-stats";
import { useAuth } from "@/lib/auth.tsx";

function StatsSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
       <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-24" />
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

function DashboardContent() {
    const { toast } = useToast();
    const router = useRouter();
    const { isLoading: isAuthLoading, isAuthenticated } = useAuth();

    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async () => {
        if (!isAuthenticated) return;
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication required.");
            setIsLoading(false);
            return;
        }
        
        try {
            const data = await getAdminDashboardMetrics(token);
            setMetrics(data);
            setError(null);
        } catch (error: any) {
            if (error.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(error.message || "Failed to load dashboard metrics.");
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            }
        }
    }, [router, toast, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            setIsLoading(true);
            fetchMetrics().finally(() => setIsLoading(false));
        }
    }, [fetchMetrics, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;
        
        const intervalId = setInterval(async () => {
            await fetchMetrics();
        }, REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [isAuthenticated, fetchMetrics]);


    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchMetrics();
        setIsRefreshing(false);
    };

    if (isAuthLoading) {
      return <StatsSkeleton />;
    }
    
    return (
        <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Admin Dashboard"
                    description="Welcome to the admin control center."
                    className="pb-0"
                />
                <Button onClick={handleRefresh} disabled={isRefreshing || isLoading}>
                    {(isRefreshing || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Refresh
                </Button>
            </div>
            
             {error ? (
                <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
            ) : (
                <>
                    <AdminDashboardStats metrics={metrics} isLoading={isLoading} />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <UserStats metrics={metrics?.users ?? null} isLoading={isLoading} />
                        <PetStats metrics={metrics?.pets ?? null} isLoading={isLoading} />
                        <ReportStats metrics={metrics?.reports ?? null} isLoading={isLoading} />
                        <AdoptionStats metrics={metrics?.adoptions ?? null} isLoading={isLoading} />
                    </div>
                </>
            )}
        </div>
    );
}


export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<StatsSkeleton />}>
        <DashboardContent />
    </Suspense>
  );
}
