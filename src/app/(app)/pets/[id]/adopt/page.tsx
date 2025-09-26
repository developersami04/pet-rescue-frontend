
'use client';

import { pets } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdoptionForm } from "./_components/adoption-form";
import { useMemo } from "react";

export default function AdoptPage() {
  const params = useParams();
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;

  const pet = useMemo(() => pets.find((p) => p.id === petId), [petId]);

  if (!pet) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title={`Adopt ${pet.name}`}
        description="Please fill out the form below to apply for adoption."
      />
      <Card>
        <CardHeader>
          <CardTitle>Adoption Application</CardTitle>
        </CardHeader>
        <CardContent>
          <AdoptionForm petName={pet.name} />
        </CardContent>
      </Card>
    </div>
  );
}
