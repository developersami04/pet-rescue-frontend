
'use client';

import { UserProfileCard } from "./_components/user-profile-card";
import { FavoritePets } from "./_components/favorite-pets";
import { MyPetsSection } from "../dashboard/_components/my-pets-section";
import { useEffect, useState, useCallback } from "react";
import type { Pet } from "@/lib/data";
import { getMyPets } from "@/lib/action_api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <UserProfileCard />
            <MyPetsSection myPets={myPets} />
        </div>
        <div className="lg:col-span-1">
            <FavoritePets />
        </div>
      </div>
    </div>
  )
}
