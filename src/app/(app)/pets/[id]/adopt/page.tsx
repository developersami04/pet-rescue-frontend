
'use client';

import { notFound, useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdoptionForm } from "./_components/adoption-form";
import { useEffect, useState } from "react";
import type { Pet } from "@/lib/data";
import { getPetById } from "@/lib/action_api";
import { useToast } from "@/hooks/use-toast";

export default function AdoptPage() {
  const params = useParams();
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [pet, setPet] = useState<Pet | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPet() {
        if (!petId) return;
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Authentication required.");
            return;
        }

        try {
            const foundPet = await getPetById(token, petId);
            if (foundPet) {
                setPet(foundPet);
            } else {
                notFound();
            }
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({
                    variant: 'destructive',
                    title: 'Session Expired',
                    description: 'Please log in again to continue.',
                });
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.dispatchEvent(new Event('storage'));
                router.push('/login');
            } else {
                console.error(e.message || "Failed to fetch pet details.");
            }
        }
    }
    fetchPet();
  }, [petId, router, toast]);


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

    