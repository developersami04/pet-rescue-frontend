
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPetById } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth.tsx';
import type { Pet } from '@/lib/data';

import Loading from './loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PetProfileHeader } from './_components/pet-profile-header';
import { PetDetailsCard } from './_components/pet-details-card';
import { MedicalHistoryContent } from './_components/medical-history-card';
import { PetReportContent } from './_components/pet-report-card';
import { AdoptionRequestsCard } from './_components/adoption-request-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPetDetails = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Please log in to view pet details.' });
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      const petData = await getPetById(token, petId);
      setPet(petData);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch pet details.');
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsLoading(false);
    }
  }, [petId, router, toast]);

  useEffect(() => {
    fetchPetDetails();
  }, [fetchPetDetails]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Failed to load pet profile</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!pet) {
    return null; // Or a "Pet not found" component
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-8">
        <PetProfileHeader pet={pet} onUpdate={fetchPetDetails} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <PetDetailsCard pet={pet} />
            </div>

            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardContent className="p-4">
                        <Accordion type="single" collapsible defaultValue="medical-history" className="w-full">
                            <AccordionItem value="medical-history">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">Medical History</AccordionTrigger>
                                <AccordionContent>
                                    <MedicalHistoryContent history={pet.medical_history} />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="pet-report">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">Pet Report</AccordionTrigger>
                                <AccordionContent>
                                    <PetReportContent report={pet.pet_report} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>

        {pet.adoption_requests && pet.adoption_requests.length > 0 && (
            <AdoptionRequestsCard requests={pet.adoption_requests} petName={pet.name}/>
        )}

      </div>
    </div>
  );
}
