
import type { Pet } from "@/lib/data";
import { notFound } from "next/navigation";
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
import { cookies } from "next/headers";

async function getPetData(petId: string) {
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
        // This case should ideally be handled by middleware, but we can have a fallback.
        // For a server component, we can't redirect directly, but we can show an error or a login prompt.
        // Or, if this page is protected by the layout, this might not even be reached.
        return { pet: null, error: "Authentication required to view pet details." };
    }

    try {
        const petData = await getPetById(token, petId);
        return { pet: petData, error: null };
    } catch (e: any) {
        console.error("Failed to fetch pet details on server:", e);
        if (e.message.toLowerCase().includes('not found')) {
            notFound();
        }
        return { pet: null, error: e.message || "Failed to fetch pet details." };
    }
}


export default async function PetProfilePage({ params }: { params: { id: string } }) {
  const { id: petId } = params;
  const { pet, error } = await getPetData(petId);

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
