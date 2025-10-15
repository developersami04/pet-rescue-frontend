'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdatePetFormAdmin } from "./_components/update-pet-form-admin";
import { useParams } from "next/navigation";

export default function UpdateRequestPage() {
  const params = useParams();
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Update Pet Details (Admin)"
        description="Modify the form below to update the pet's details."
      />
      <Card>
          <CardHeader>
            <CardTitle>Update Pet Form</CardTitle>
            <CardDescription>
              Use this form to update an existing pet's information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePetFormAdmin petId={petId} />
          </CardContent>
      </Card>
    </div>
  );
}
