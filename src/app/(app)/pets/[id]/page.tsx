
'use client';

import type { Pet } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { PetImageCarousel } from "./_components/pet-image-carousel";
import { PetDetails } from "./_components/pet-details";
import { getPetById } from "@/lib/action_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalHistoryList } from "./_components/medical-history-list";
import { AdoptionRequestsList } from "./_components/adoption-requests-list";
import { PetReportList } from "./_components/pet-report-list";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState }from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

function PetProfileSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
       <div className="mt-12">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full mt-6" />
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
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    async function fetchPet() {
        if (!petId) {
            setIsLoading(false);
            return;
        };

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication required to view pet details.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const foundPet = await getPetById(token, petId);
            if (foundPet) {
                setPet(foundPet);
            } else {
                setError("Pet not found.");
            }
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
            }
        } finally {
            setIsLoading(false);
        }
    }
    fetchPet();
  }, [petId, router, toast]);


  if (isLoading) {
    return <PetProfileSkeleton />;
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

  const reports = pet.pet_report ? [pet.pet_report] : [];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <PetImageCarousel pet={pet} />
        <PetDetails pet={pet} />
      </div>
      <Tabs defaultValue="medical-history" className="mt-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {reports.length > 0 &&
              <Badge variant="destructive" className="ml-2">{reports.length}</Badge>
            }
          </TabsTrigger>
          <TabsTrigger value="adoption-requests">
            Adoption Requests 
            {pet.adoption_requests && pet.adoption_requests.length > 0 && 
              <Badge className="ml-2">{pet.adoption_requests.length}</Badge>
            }
          </TabsTrigger>
        </TabsList>
        <TabsContent value="medical-history" className="mt-6">
          <MedicalHistoryList medicalHistory={pet.medical_history} />
        </TabsContent>
         <TabsContent value="reports" className="mt-6">
            <PetReportList reports={reports} />
        </TabsContent>
        <TabsContent value="adoption-requests" className="mt-6">
            <AdoptionRequestsList requests={pet.adoption_requests} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
