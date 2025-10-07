
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PawPrint, FileText, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getAdminDashboardMetrics } from "@/lib/actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type Metrics = {
    total_users: number;
    total_pets: number;
    pending_reports: number;
    total_adoption_requests: number;
};

function StatCard({ title, value, icon, isLoading }: { title: string, value: number, icon: React.ReactNode, isLoading: boolean }) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className="text-muted-foreground">{icon}</div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2" />
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export function AdminDashboardStats() {
    const { toast } = useToast();
    const router = useRouter();

    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication required.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const data = await getAdminDashboardMetrics(token);
            setMetrics(data);
        } catch (error: any) {
            if (error.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(error.message || "Failed to load dashboard metrics.");
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            }
        } finally {
            setIsLoading(false);
        }
    }, [router, toast]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const stats = [
        { title: "Total Users", value: metrics?.total_users, icon: <Users className="h-4 w-4" /> },
        { title: "Total Pets", value: metrics?.total_pets, icon: <PawPrint className="h-4 w-4" /> },
        { title: "Pending Reports", value: metrics?.pending_reports, icon: <FileText className="h-4 w-4" /> },
        { title: "Adoption Requests", value: metrics?.total_adoption_requests, icon: <CheckCircle className="h-4 w-4" /> },
    ];
    
    if (error) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => (
                 <StatCard 
                    key={stat.title}
                    title={stat.title}
                    value={stat.value ?? 0}
                    icon={stat.icon}
                    isLoading={isLoading}
                 />
            ))}
        </div>
    );
}
