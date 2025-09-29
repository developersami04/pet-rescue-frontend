
'use client';
import type { Pet } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { PetImageCarousel } from "./_components/pet-image-carousel";
import { PetDetails } from "./_components/pet-details";
import { useEffect, useState } from "react";
import { getAllPets } from "@/lib/action_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


function PetProfilePageSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="grid gap-4">
                <Skeleton className="aspect-square w-full" />
            </div>
            <div className="grid gap-4 md:gap-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="flex items-center gap-2 flex-wrap">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                </div>
                <Skeleton className="h-24 w-full" />
                <div className="grid gap-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}

export default function PetProfilePage() {
  const params = useParams();
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchPet() {
        if (!petId) return;
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication required.");
            setIsLoading(false);
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
            setError(e.message || "Failed to fetch pet details.");
        } finally {
            setIsLoading(false);
        }
    }
    fetchPet();
  }, [petId]);


  if (isLoading) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PetProfilePageSkeleton />
        </div>
    );
  }

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

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <PetImageCarousel pet={pet} />
        <PetDetails pet={pet} />
      </div>
    </div>
  );
}
