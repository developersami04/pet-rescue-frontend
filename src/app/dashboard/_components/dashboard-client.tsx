
'use client';

import { Suspense, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

function TabSkeleton() {
  return (
    <div className="flex items-center justify-center p-8 h-64 border-2 border-dashed rounded-lg">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  )
}

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState("my-pets");

  const tabs = [
      { value: "my-pets", content: <MyPetsTab /> },
      { value: "lost-pets", content: <LostPetsTab /> },
      { value: "found-pets", content: <FoundPetsTab /> },
      { value: "adoptable-pets", content: <AdoptablePetsTab /> },
      { value: "my-requests", content: <MyRequestsTab /> },
      { value: "adoption-requests-received", content: <AdoptionRequestsReceivedTab /> },
  ];

  return (
    <>
      <DashboardStats />
      <Separator className="my-8" />
      
        <Tabs defaultValue="my-pets" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="mt-6">
              {tabs.map(tab => (
                  <TabsContent key={tab.value} value={tab.value}>
                      <Suspense fallback={<TabSkeleton />}>
                          {tab.content}
                      </Suspense>
                  </TabsContent>
              ))}
            </div>
        </Tabs>
    </>
  );
}
