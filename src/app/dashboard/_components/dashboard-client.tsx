
'use client';

import { Suspense, useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardStats } from "./dashboard-stats";
import { DashboardTabs } from "./dashboard-tabs";
import { MyPetsTab } from "./tabs/my-pets-tab";
import { LostPetsTab } from "./tabs/lost-pets-tab";
import { FoundPetsTab } from "./tabs/found-pets-tab";
import { AdoptablePetsTab } from "./tabs/adoptable-pets-tab";
import { MyRequestsTab } from "./tabs/my-requests-tab";
import { AdoptionRequestsReceivedTab } from "./tabs/adoption-requests-received-tab";
import { Pet, PetReport, MyAdoptionRequest, AdoptionRequest, FavoritePet } from "@/lib/data";
import { getMyPets, getMyPetData, getFavoritePets } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FavoritesTab } from "./tabs/favorites-tab";
import { useAuth } from "@/lib/auth";


type TabData = {
    'my-pets': Pet[] | null;
    'lost-pets': PetReport[] | null;
    'found-pets': PetReport[] | null;
    'adoptable-pets': PetReport[] | null;
    'my-requests': MyAdoptionRequest[] | null;
    'adoption-requests-received': AdoptionRequest[] | null;
    'favorites': FavoritePet[] | null;
};

type LoadingStates = {
    [key in keyof TabData]: boolean;
};

type ErrorStates = {
    [key in keyof TabData]: string | null;
};

function TabSkeleton() {
  return (
    <div className="flex items-center justify-center p-8 h-64 border-2 border-dashed rounded-lg">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  )
}

const tabApiMap: { [key: string]: 'lost' | 'found' | 'adopt' | 'my-adoption-requests' | 'adoption-requests-received' } = {
    'lost-pets': 'lost',
    'found-pets': 'found',
    'adoptable-pets': 'adopt',
    'my-requests': 'my-adoption-requests',
    'adoption-requests-received': 'adoption-requests-received',
};

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState("my-pets");
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [tabData, setTabData] = useState<TabData>({
      'my-pets': null,
      'lost-pets': null,
      'found-pets': null,
      'adoptable-pets': null,
      'my-requests': null,
      'adoption-requests-received': null,
      'favorites': null,
  });

  const [loading, setLoading] = useState<LoadingStates>({
      'my-pets': false,
      'lost-pets': false,
      'found-pets': false,
      'adoptable-pets': false,
      'my-requests': false,
      'adoption-requests-received': false,
      'favorites': false,
  });

  const [errors, setErrors] = useState<ErrorStates>({
      'my-pets': null,
      'lost-pets': null,
      'found-pets': null,
      'adoptable-pets': null,
      'my-requests': null,
      'adoption-requests-received': null,
      'favorites': null,
  });

  const fetchTabData = useCallback(async (tab: string, force = false) => {
    if ((tabData[tab as keyof TabData] !== null && !force) || !isAuthenticated) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        setErrors(prev => ({...prev, [tab]: 'You are not authenticated.'}));
        return;
    }
    
    setLoading(prev => ({...prev, [tab]: true}));
    setErrors(prev => ({...prev, [tab]: null}));

    try {
        let result;
        if (tab === 'my-pets') {
            result = await getMyPets(token);
        } else if (tab === 'favorites') {
            result = await getFavoritePets(token);
        } else if (tabApiMap[tab]) {
            result = await getMyPetData(token, tabApiMap[tab]);
        }

        setTabData(prev => ({ ...prev, [tab]: result || [] }));
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired' });
            router.push('/login');
        } else {
            setErrors(prev => ({ ...prev, [tab]: `Could not fetch data for ${tab}.` }));
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    } finally {
        setLoading(prev => ({...prev, [tab]: false}));
    }
  }, [router, toast, isAuthenticated, tabData]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTabData(activeTab);
    }
  }, [activeTab, fetchTabData, isAuthenticated]);
  
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      // Re-fetch data for the currently active tab
      fetchTabData(activeTab, true);
    }, REFRESH_INTERVAL);

    // Clear interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [isAuthenticated, activeTab, fetchTabData]);


  const handleDataRefresh = (tab: keyof TabData) => {
      setTabData(prev => ({...prev, [tab]: null}));
      fetchTabData(tab);
  }

  const renderTabContent = (tab: keyof TabData) => {
      if (loading[tab]) {
          return <TabSkeleton />;
      }
      if (errors[tab]) {
          return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{errors[tab]}</AlertDescription></Alert>;
      }

      const data = tabData[tab];

      switch(tab) {
          case 'my-pets':
              return <MyPetsTab pets={data as Pet[] ?? []} />;
          case 'lost-pets':
              return <LostPetsTab pets={data as PetReport[] ?? []} />;
          case 'found-pets':
              return <FoundPetsTab pets={data as PetReport[] ?? []} />;
          case 'adoptable-pets':
              return <AdoptablePetsTab pets={data as PetReport[] ?? []} />;
          case 'my-requests':
              return <MyRequestsTab requests={data as MyAdoptionRequest[] ?? []} onUpdate={() => handleDataRefresh(tab)} />;
          case 'adoption-requests-received':
              return <AdoptionRequestsReceivedTab requests={data as AdoptionRequest[] ?? []} onUpdate={() => handleDataRefresh(tab)} />;
          case 'favorites':
              return <FavoritesTab favoritePets={data as FavoritePet[] ?? []} onUpdate={() => handleDataRefresh(tab)} />;
          default:
              return null;
      }
  };

  return (
    <>
      <DashboardStats />
      <Separator className="my-8" />
      
        <Tabs defaultValue="my-pets" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="mt-6">
                <TabsContent value="my-pets">{renderTabContent('my-pets')}</TabsContent>
                <TabsContent value="lost-pets">{renderTabContent('lost-pets')}</TabsContent>
                <TabsContent value="found-pets">{renderTabContent('found-pets')}</TabsContent>
                <TabsContent value="adoptable-pets">{renderTabContent('adoptable-pets')}</TabsContent>
                <TabsContent value="my-requests">{renderTabContent('my-requests')}</TabsContent>
                <TabsContent value="adoption-requests-received">{renderTabContent('adoption-requests-received')}</TabsContent>
                <TabsContent value="favorites">{renderTabContent('favorites')}</TabsContent>
            </div>
        </Tabs>
    </>
  );
}
