
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddPetForm } from "./_components/add-pet-form";
import { PetMedicalHistoryForm } from "./_components/pet-medical-history-form";
import { PetReportForm } from "./_components/pet-report-form";

export default function SubmitRequestPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Submit a Request"
        description="Select a form below to add a pet, update medical history, or report a pet."
      />
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="add-pet">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
              <TabsTrigger value="add-pet">Add Pet</TabsTrigger>
              <TabsTrigger value="medical-history">
                Pet Medical History
              </TabsTrigger>
              <TabsTrigger value="pet-report">Pet Report</TabsTrigger>
            </TabsList>
            <TabsContent value="add-pet">
              <Card>
                <CardHeader>
                  <CardTitle>List a New Pet</CardTitle>
                  <CardDescription>
                    Fill out the form below to list a new pet for adoption.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddPetForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="medical-history">
              <Card>
                <CardHeader>
                  <CardTitle>Update Pet Medical History</CardTitle>
                  <CardDescription>
                    Add a new medical record for one of your pets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PetMedicalHistoryForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pet-report">
              <Card>
                <CardHeader>
                  <CardTitle>Report a Pet</CardTitle>
                  <CardDescription>
                    Report a pet that is lost or that you have found.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PetReportForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
