
'use client';

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { MyPetsSection } from "./my-pets-section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LostPetsSection } from "./lost-pets-section";
import { FoundPetsSection } from "./found-pets-section";
import { AdoptablePetsSection } from "./adoptable-pets-section";
import { MyRequestsSection } from "./my-requests-section";
import { Pet, PetReport, MyAdoptionRequest } from "@/lib/data";
import { getMyPets, getMyPetData } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { DashboardStats } from "./dashboard-stats";
import { DashboardTabs } from "./dashboard-tabs";

export function DashboardClient() {
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [lostPets, setLostPets] = useState<PetReport[]>([]);
  const [foundPets, setFoundPets] = useState<PetReport[]>([]);
  const [adoptablePets, setAdoptablePets] = useState<PetReport[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<MyAdoptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-pets");
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
        setAdoptablePets(adoptablePetsData as PetReport[]);
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

  const tabs = [
      { value: "my-pets", content: <MyPetsSection myPets={myPets} /> },
      { value: "lost-pets", content: <LostPetsSection lostPets={lostPets} /> },
      { value: "found-pets", content: <FoundPetsSection foundPets={foundPets} /> },
      { value: "adoptable-pets", content: <AdoptablePetsSection adoptablePets={adoptablePets} /> },
      { value: "my-requests", content: <MyRequestsSection requests={adoptionRequests} onUpdate={fetchDashboardData} /> },
  ];

  return (
    <>
      <DashboardStats 
        myPetsCount={myPets.length}
        lostPetsCount={lostPets.length}
        foundPetsCount={foundPets.length}
        adoptablePetsCount={adoptablePets.length}
        myRequestsCount={adoptionRequests.length}
        isLoading={isLoading}
      />
      <Separator className="my-8" />
      
        <Tabs defaultValue="my-pets" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="mt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8 h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    tabs.map(tab => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {tab.content}
                        </TabsContent>
                    ))
                )}
            </div>
        </Tabs>
    </>
  );
}
