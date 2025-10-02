
'use client';

import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "./_components/dashboard-stats";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, PlusCircle } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MyPetsSection } from "./_components/my-pets-section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LostPetsSection } from "./_components/lost-pets-section";
import { FoundPetsSection } from "./_components/found-pets-section";
import { MyAdoptionRequestsSection } from "./_components/my-adoption-requests-section";
import { Pet, PetReport, MyAdoptionRequest } from "@/lib/data";
import { getMyPets, getMyPetData } from "@/lib/action_api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


function DashboardStatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
    )
}

export default function DashboardPage() {
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [lostPets, setLostPets] = useState<PetReport[]>([]);
  const [foundPets, setFoundPets] = useState<PetReport[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<MyAdoptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  
  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const [myPetsData, lostPetsData, foundPetsData, adoptionRequestsData] = await Promise.all([
            getMyPets(token),
            getMyPetData(token, 'lost'),
            getMyPetData(token, 'found'),
            getMyPetData(token, 'adopted'),
        ]);

        setMyPets(myPetsData);
        setLostPets(lostPetsData as PetReport[]);
        setFoundPets(foundPetsData as PetReport[]);
        setAdoptionRequests(adoptionRequestsData as MyAdoptionRequest[]);

    } catch (error: any) {
         if (error.message.includes('Session expired')) {
            toast({
                variant: 'destructive',
                title: 'Session Expired',
                description: 'Please log in again to continue.',
            });
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.dispatchEvent(new Event('storage'));
            router.push('/login');
        } else {
            console.error("Failed to fetch dashboard data:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not fetch dashboard data.',
            });
        }
    } finally {
        setIsLoading(false);
    }

  }, [router, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Welcome to Pet-Pal"
          description="Your dashboard for finding a new companion."
          className="pb-0"
        />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/submit-request">
            <PlusCircle className="mr-2 h-4 w-4" />
            Pet Request Form
          </Link>
        </Button>
      </div>
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>
      
      <Separator className="my-8" />
      
        <Tabs defaultValue="my-pets" className="mt-8">
            <TabsList className="mb-6 h-auto flex-wrap justify-start">
                <TabsTrigger value="my-pets">My Pets</TabsTrigger>
                <TabsTrigger value="lost-pets">Lost Pets</TabsTrigger>
                <TabsTrigger value="found-pets">Found Pets</TabsTrigger>
                <TabsTrigger value="my-requests">My Adopt Requests</TabsTrigger>
            </TabsList>
            {isLoading ? (
                <div className="flex items-center justify-center p-8 h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <TabsContent value="my-pets">
                        <MyPetsSection myPets={myPets} />
                    </TabsContent>
                    <TabsContent value="lost-pets">
                        <LostPetsSection lostPets={lostPets} />
                    </TabsContent>
                    <TabsContent value="found-pets">
                        <FoundPetsSection foundPets={foundPets} />
                    </TabsContent>
                    <TabsContent value="my-requests">
                        <MyAdoptionRequestsSection requests={adoptionRequests} />
                    </TabsContent>
                </>
            )}
        </Tabs>
    </div>
  );
}
