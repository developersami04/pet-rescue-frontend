

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddPetForm } from "./_components/add-pet-form";

export default function SubmitRequestPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Submit a Request"
        description="Fill out the form below to add a pet, update medical history, or report a pet."
      />
      <Card>
          <CardHeader>
            <CardTitle>Pet Request Form</CardTitle>
            <CardDescription>
              Use this form to add a new pet, report a found pet, and provide their details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddPetForm />
          </CardContent>
      </Card>
    </div>
  );
}
