
'use client';

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { MyPetsSection } from "./my-pets-section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LostPetsSection } from "./lost-pets-section";
import { FoundPetsSection } from "./found-pets-section";
import { MyRequestsSection } from "./my-requests-section";
import { Pet, PetReport, MyAdoptionRequest } from "@/lib/data";
import { getMyPets, getMyPetData } from "@/lib/action_api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AdoptablePetsSection } from "./adoptable-pets-section";

export function DashboardClient() {
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [lostPets, setLostPets] = useState<PetReport[]>([]);
  const [foundPets, setFoundPets] = useState<PetReport[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<MyAdoptionRequest[]>([]);
  const [adoptablePets, setAdoptablePets] = useState<PetReport[]>([]);
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
        const [myPetsData, lostPetsData, foundPetsData, adoptionRequestsData, adoptablePetsData] = await Promise.all([
            getMyPets(token),
            getMyPetData(token, 'lost'),
            getMyPetData(token, 'found'),
            getMyPetData(token, 'my-adoption-requests'),
            getMyPetData(token, 'adopt')
        ]);

        setMyPets(myPetsData);
        setLostPets(lostPetsData as PetReport[]);
        setFoundPets(foundPetsData as PetReport[]);
        setAdoptionRequests(adoptionRequestsData as MyAdoptionRequest[]);
        setAdoptablePets(adoptablePetsData as PetReport[]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <>
      <Separator className="my-8" />
      
        <Tabs defaultValue="my-pets" className="mt-8">
            <TabsList className="mb-6 h-auto flex-wrap justify-start">
                <TabsTrigger value="my-pets">My Pets</TabsTrigger>
                <TabsTrigger value="lost-pets">Lost Pets</TabsTrigger>
                <TabsTrigger value="found-pets">Found Pets</TabsTrigger>
                <TabsTrigger value="adoptable-pets">Adoptable Pets</TabsTrigger>
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
                    <TabsContent value="adoptable-pets">
                        <AdoptablePetsSection adoptablePets={adoptablePets} />
                    </TabsContent>
                    <TabsContent value="my-requests">
                        <MyRequestsSection requests={adoptionRequests} />
                    </TabsContent>
                </>
            )}
        </Tabs>
    </>
  );
}
