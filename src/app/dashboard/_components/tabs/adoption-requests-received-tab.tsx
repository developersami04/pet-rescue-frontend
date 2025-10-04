
'use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getMyPetData } from "@/lib/actions";
import { AdoptionRequest } from "@/lib/data";
import { AdoptionRequestsReceivedSection } from "../adoption-requests-received-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function TabSkeleton() {
  return <Skeleton className="h-64 w-full" />
}

export function AdoptionRequestsReceivedTab() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
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
      const result = await getMyPetData(token, 'adoption-requests-received');
      if (result) {
        setRequests(result as AdoptionRequest[]);
      }
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired' });
            router.push('/login');
        } else {
            setError('Could not fetch your received adoption requests.');
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

  return <AdoptionRequestsReceivedSection requests={requests} onUpdate={fetchData} />;
}
