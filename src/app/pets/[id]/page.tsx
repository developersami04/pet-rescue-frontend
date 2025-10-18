
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPetById, getFavoritePets } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth.tsx';
import type { Pet, FavoritePet } from '@/lib/data';

import Loading from './loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PetProfileHeader } from './_components/pet-profile-header';
import { PetDetailsCard } from './_components/pet-details-card';
import { MedicalHistoryContent } from './_components/medical-history-card';
import { PetReportContent } from './_components/pet-report-card';
import { AdoptionRequestsCard } from './_components/adoption-request-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { AdoptionRequestDialog } from './_components/adoption-request-dialog';
import { PostStoryDialog } from './_components/post-story-dialog';
import { Button } from '@/components/ui/button';
import { Film, Hand, MessageSquareQuote } from 'lucide-react';
import { UserDetailsDialog } from '@/components/user-details-dialog';
import { PetProfileStickyHeader } from './_components/pet-profile-sticky-header';

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const petId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Local state for optimistic updates
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchPetDetails = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'Please log in to view pet details.' });
      router.push('/login');
      return;
    }

    try {
      const [petData, favoritePetsData] = await Promise.all([
        getPetById(token, petId),
        getFavoritePets(token)
      ]);
      setPet(petData);
      setLikeCount(petData.likes ?? 0);
      setIsFavorited(favoritePetsData.some(fav => fav.pet_id === petData.id));

    } catch (e: any) {
      setError(e.message || 'Failed to fetch pet details.');
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, [petId, router, toast]);

  useEffect(() => {
    fetchPetDetails(true);
  }, [fetchPetDetails]);
  
  const handleFavoriteToggle = (favorited: boolean) => {
    setIsFavorited(favorited);
    setLikeCount(prev => favorited ? prev + 1 : prev - 1);
  };

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
  
  const petStatus = pet.pet_report?.pet_status;
  const isResolved = pet.pet_report?.is_resolved;
  const isAvailableForAdoption = (petStatus === 'adopt' || petStatus === 'found') && !isResolved;
  const isOwner = currentUser?.id === pet.created_by;

  const approvedRequest = pet.adoption_requests?.find(
    req => req.requester_id === currentUser?.id && req.report_status === 'approved'
  );

  return (
    <>
      <PetProfileStickyHeader 
        pet={pet} 
        isFavorited={isFavorited} 
        likeCount={likeCount}
        onFavoriteToggle={handleFavoriteToggle} 
      />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="space-y-8">
          <PetProfileHeader 
            pet={pet} 
            isFavorited={isFavorited}
            likeCount={likeCount}
            onFavoriteToggle={handleFavoriteToggle}
          />

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center p-4 bg-muted/50 rounded-lg">
              {isAvailableForAdoption && !isOwner && (
                  <AdoptionRequestDialog petId={pet.id} petName={pet.name} onUpdate={() => fetchPetDetails(false)}>
                      <Button>
                          <Hand className="mr-2 h-4 w-4" />
                          Request to Adopt
                      </Button>
                  </AdoptionRequestDialog>
              )}
              {pet.is_verified && isOwner && (
                  <PostStoryDialog petId={pet.id} petName={pet.name}>
                          <Button>
                          <Film className="mr-2 h-4 w-4" />
                          Post Story
                      </Button>
                  </PostStoryDialog>
              )}
              {approvedRequest && (
                <UserDetailsDialog userId={pet.created_by}>
                  <Button variant="secondary">
                      <MessageSquareQuote className="mr-2 h-4 w-4" />
                      Contact Owner
                  </Button>
                </UserDetailsDialog>
              )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                  <PetDetailsCard pet={pet} />
              </div>

              <div className="lg:col-span-1 space-y-8">
                  <Card>
                      <CardContent className="p-4">
                          <Accordion type="single" collapsible defaultValue="pet-report" className="w-full">
                              <AccordionItem value="pet-report">
                                  <AccordionTrigger className="text-base font-semibold hover:no-underline">Pet Report</AccordionTrigger>
                                  <AccordionContent>
                                      <PetReportContent report={pet.pet_report} />
                                  </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="medical-history">
                                  <AccordionTrigger className="text-base font-semibold hover:no-underline">Medical History</AccordionTrigger>
                                  <AccordionContent>
                                      <MedicalHistoryContent history={pet.medical_history} />
                                  </AccordionContent>
                              </AccordionItem>
                          </Accordion>
                      </CardContent>
                  </Card>
              </div>
          </div>

          {pet.adoption_requests && pet.adoption_requests.length > 0 && isOwner && (
              <AdoptionRequestsCard requests={pet.adoption_requests} petName={pet.name}/>
          )}

        </div>
      </div>
    </>
  );
}
