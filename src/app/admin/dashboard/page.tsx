
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

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  );
}

function DashboardContent() {
    const { toast } = useToast();
    const router = useRouter();

    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async () => {
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
    }, [router, toast]);

    useEffect(() => {
        setIsLoading(true);
        fetchMetrics().finally(() => setIsLoading(false));
    }, [fetchMetrics]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchMetrics();
        setIsRefreshing(false);
    };
    
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
                    <UserStats metrics={metrics?.users ?? null} isLoading={isLoading} />
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
