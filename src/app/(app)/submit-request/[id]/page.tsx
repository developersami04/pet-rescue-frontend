
'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdatePetForm } from "./_components/update-pet-form";
import { useParams } from "next/navigation";

export default function UpdateRequestPage() {
  const params = useParams();
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Update Pet Request"
        description="Modify the form below to update the pet's details."
      />
      <Card>
          <CardHeader>
            <CardTitle>Update Pet Request Form</CardTitle>
            <CardDescription>
              Use this form to update an existing pet's information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePetForm petId={petId} />
          </CardContent>
      </Card>
    </div>
  );
}
