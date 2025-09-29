
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import type { Pet } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getAllPets } from "@/lib/action_api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function FeaturedPetSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
                <Skeleton className="h-64 md:h-full" />
                <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </Card>
    );
}


export function FeaturedPet() {
    const [featuredPet, setFeaturedPet] = useState<Pet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function fetchFeaturedPet() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Authentication required.');
                setIsLoading(false);
                return;
            }
            try {
                const allPets = await getAllPets(token);
                if (allPets && allPets.length > 0) {
                    setFeaturedPet(allPets[0]);
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
                    setError(e.message || 'Could not fetch featured pet.');
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchFeaturedPet();
    }, [router, toast]);

    if (isLoading) {
        return <FeaturedPetSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!featuredPet) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No featured pet available at the moment.
                </CardContent>
            </Card>
        );
    }
    
    const imageUrl = featuredPet.image ?? `https://picsum.photos/seed/${featuredPet.id}/600/400`;

    return (
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-full">
                    <Image
                        src={imageUrl}
                        alt={featuredPet.name}
                        fill
                        className="object-cover"
                        data-ai-hint={featuredPet.breed ?? featuredPet.type_name}
                    />
                </div>
                <div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">{featuredPet.name}</CardTitle>
                        <CardDescription>{featuredPet.breed} &bull; {featuredPet.age ?? 'N/A'} years old</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground line-clamp-3">{featuredPet.description}</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild>
                            <Link href={`/pets/${featuredPet.id}`}>Meet {featuredPet.name}</Link>
                        </Button>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}
