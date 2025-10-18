
'use client';

import { UserProfileCard } from "./_components/user-profile-card";
import { FavoritePets } from "./_components/favorite-pets";
import { MyPetsSection } from "../dashboard/_components/my-pets-section";
import { useEffect, useState, useCallback } from "react";
import type { Pet } from "@/lib/data";
import { getMyPets } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";


export default function ProfilePage() {
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  
  const fetchMyPets = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        setIsLoading(false);
        return;
    }

    try {
        const userPets = await getMyPets(token);
        setMyPets(userPets);
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
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
            toast({
                variant: 'destructive',
                title: "Error fetching pets",
                description: "Could not fetch your listed pets.",
            });
            console.error("Failed to fetch user's pets:", error);
        }
    } finally {
        setIsLoading(false);
    }
  }, [router, toast]);


  useEffect(() => {
      fetchMyPets();
  }, [fetchMyPets]);
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <UserProfileCard />

        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">My Pets</h2>
            <MyPetsSection myPets={myPets} />
        </div>
        
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">Favorite Pets</h2>
            <FavoritePets />
        </div>
      </div>
    </div>
  )
}
