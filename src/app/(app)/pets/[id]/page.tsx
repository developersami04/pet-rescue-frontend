
'use client';
import type { Pet } from "@/lib/data";
import { notFound, useParams, useRouter } from "next/navigation";
import { PetImageCarousel } from "./_components/pet-image-carousel";
import { PetDetails } from "./_components/pet-details";
import { useEffect, useState } from "react";
import { getPetById } from "@/lib/action_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalHistoryList } from "./_components/medical-history-list";
import { AdoptionRequestsList } from "./_components/adoption-requests-list";
import { PetReportList } from "./_components/pet-report-list";
import { Badge } from "@/components/ui/badge";


function PetProfilePageSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="grid gap-4">
                <Skeleton className="aspect-square w-full" />
            </div>
            <div className="grid gap-4 md:gap-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="flex items-center gap-2 flex-wrap">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                </div>
                <Skeleton className="h-24 w-full" />
                <div className="grid gap-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}

export default function PetProfilePage() {
  const params = useParams();
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchPet() {
        if (!petId) return;
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication required.");
            setIsLoading(false);
            return;
        }

        try {
            const petData = await getPetById(token, petId);
            setPet(petData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
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
                setError(e.message || "Failed to fetch pet details.");
                // Check for 404 Not Found specifically if possible from the error
                if (e.message.toLowerCase().includes('not found')) {
                  notFound();
                }
            }
        } finally {
            setIsLoading(false);
        }
    }
    fetchPet();
  }, [petId, router, toast]);


  if (isLoading) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PetProfilePageSkeleton />
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!pet) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <PetImageCarousel pet={pet} />
        <PetDetails pet={pet} />
      </div>
      <Tabs defaultValue="medical-history" className="mt-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="adoption-requests">
            Adoption Requests 
            {pet.adoption_requests && pet.adoption_requests.length > 0 && 
              <Badge className="ml-2">{pet.adoption_requests.length}</Badge>
            }
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {pet.pet_report && pet.pet_report.length > 0 &&
              <Badge variant="destructive" className="ml-2">{pet.pet_report.length}</Badge>
            }
          </TabsTrigger>
        </TabsList>
        <TabsContent value="medical-history" className="mt-6">
          <MedicalHistoryList pet={pet} />
        </TabsContent>
        <TabsContent value="adoption-requests" className="mt-6">
            <AdoptionRequestsList requests={pet.adoption_requests} />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
            <PetReportList reports={pet.pet_report} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
