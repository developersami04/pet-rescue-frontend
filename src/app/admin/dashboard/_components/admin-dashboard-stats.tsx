
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, PawPrint, FileText, CheckCircle, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getAdminDashboardMetrics } from "@/lib/actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AdminStatDetailsDialog } from "./admin-stat-details-dialog";
import { Button } from "@/components/ui/button";

type Metrics = {
    no_of_users: number;
    no_of_current_pets: number;
    no_of_unverified_pets: number;
    no_of_verified_pets: number;
    no_of_lost_reports: number;
    no_of_found_reports: number;
    no_of_pending_reports: number;
    no_of_adoption_requests: number;
    no_of_successful_adoptions: number;
};

function StatCard({ title, value, icon, isLoading, details, detailsTitle }: { title: string, value: number, icon: React.ReactNode, isLoading: boolean, details?: Record<string, number>, detailsTitle?: string }) {
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

    const cardContent = (
         <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
            {details && (
                <CardFooter className="p-2 pt-0 border-t mt-auto">
                    <AdminStatDetailsDialog
                        trigger={
                            <Button variant="ghost" size="sm" className="w-full">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Button>
                        }
                        title={detailsTitle || `Details for ${title}`}
                        data={details}
                    />
                </CardFooter>
            )}
        </Card>
    );

    return cardContent;
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
    
    if (error) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <StatCard 
                title="Total Users" 
                value={metrics?.no_of_users ?? 0}
                icon={<Users className="h-4 w-4" />}
                isLoading={isLoading}
             />
             <StatCard 
                title="Total Pets" 
                value={metrics?.no_of_current_pets ?? 0}
                icon={<PawPrint className="h-4 w-4" />}
                isLoading={isLoading}
                detailsTitle="Pet Verification Breakdown"
                details={{
                    "Verified Pets": metrics?.no_of_verified_pets ?? 0,
                    "Unverified Pets": metrics?.no_of_unverified_pets ?? 0,
                }}
             />
             <StatCard 
                title="Pending Reports" 
                value={metrics?.no_of_pending_reports ?? 0}
                icon={<FileText className="h-4 w-4" />}
                isLoading={isLoading}
                detailsTitle="Pending Report Types"
                details={{
                    "Lost Reports": metrics?.no_of_lost_reports ?? 0,
                    "Found Reports": metrics?.no_of_found_reports ?? 0,
                }}
             />
             <StatCard 
                title="Adoption Requests" 
                value={metrics?.no_of_adoption_requests ?? 0}
                icon={<CheckCircle className="h-4 w-4" />}
                isLoading={isLoading}
                detailsTitle="Adoption Funnel"
                details={{
                    "Pending Requests": metrics?.no_of_adoption_requests ?? 0,
                    "Successful Adoptions": metrics?.no_of_successful_adoptions ?? 0,
                }}
             />
        </div>
    );
}
