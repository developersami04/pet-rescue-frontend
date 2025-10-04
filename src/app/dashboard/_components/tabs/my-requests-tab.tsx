
'use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getMyPetData } from "@/lib/actions";
import { MyAdoptionRequest } from "@/lib/data";
import { MyRequestsSection } from "../my-requests-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function TabSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
    </div>
  )
}

export function MyRequestsTab() {
  const [requests, setRequests] = useState<MyAdoptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);

    try {
      const result = await getMyPetData(token, 'my-adoption-requests');
      if (result) {
        setRequests(result as MyAdoptionRequest[]);
      }
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired' });
            router.push('/login');
        } else {
            setError('Could not fetch your sent adoption requests.');
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    } finally {
        setIsLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <TabSkeleton />;
  }

  if (error) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return <MyRequestsSection requests={requests} onUpdate={fetchData} />;
}
