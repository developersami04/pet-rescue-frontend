




import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "./_components/dashboard-stats";
import { FeaturedPet } from "./_components/featured-pet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MyPetsSection } from "./_components/my-pets-section";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LostPetsSection } from "./_components/lost-pets-section";
import { FoundPetsSection } from "./_components/found-pets-section";
import { MyAdoptionRequestsSection } from "./_components/my-adoption-requests-section";
import { Card, CardContent } from "@/components/ui/card";

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
            Submit a Request
          </Link>
        </Button>
      </div>
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>
      
      <Separator className="my-8" />
      
        <Tabs defaultValue="my-pets" className="mt-8">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="my-pets">My Pets</TabsTrigger>
                <TabsTrigger value="lost-pets">Lost Pets</TabsTrigger>
                <TabsTrigger value="found-pets">Found Pets</TabsTrigger>
                <TabsTrigger value="my-requests">My Adopt Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="my-pets">
                <MyPetsSection />
            </TabsContent>
            <TabsContent value="lost-pets">
                <LostPetsSection />
            </TabsContent>
            <TabsContent value="found-pets">
                <FoundPetsSection />
            </TabsContent>
            <TabsContent value="my-requests">
                <MyAdoptionRequestsSection />
            </TabsContent>
        </Tabs>


      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Featured Pet
        </h2>
        <FeaturedPet />
      </div>
    </div>
  );
}
