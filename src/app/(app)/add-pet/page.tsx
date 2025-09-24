import { PageHeader } from "@/components/page-header";
import { AddPetForm } from "./_components/add-pet-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddPetPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Add a New Pet"
        description="Fill out the form below to list a new pet for adoption."
      />
      <Card>
        <CardHeader>
          <CardTitle>Pet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AddPetForm />
        </CardContent>
      </Card>
    </div>
  );
}
