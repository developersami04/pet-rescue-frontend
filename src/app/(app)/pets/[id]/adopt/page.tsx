"use client";

import { pets } from "@/lib/data";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdoptionForm } from "./_components/adoption-form";

export default function AdoptPage({ params }: { params: { id: string } }) {
  const pet = pets.find((p) => p.id === params.id);

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
