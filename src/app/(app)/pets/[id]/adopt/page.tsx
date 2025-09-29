
'use client';

import { notFound, useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdoptionForm } from "./_components/adoption-form";
import { useEffect, useState } from "react";
import type { Pet } from "@/lib/data";
import { getAllPets } from "@/lib/action_api";

export default function AdoptPage() {
  const params = useParams();
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    async function fetchPet() {
        if (!petId) return;
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Authentication required.");
            return;
        }

        try {
            const allPets = await getAllPets(token);
            const foundPet = allPets.find((p: Pet) => p.id.toString() === petId);
            if (foundPet) {
                setPet(foundPet);
            } else {
                notFound();
            }
        } catch (e: any) {
            console.error(e.message || "Failed to fetch pet details.");
        }
    }
    fetchPet();
  }, [petId]);


  if (!pet) {
    // You might want to show a loading state here
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PageHeader title="Loading..." description="Fetching pet details..." />
        </div>
    )
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
