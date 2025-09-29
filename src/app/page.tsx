
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { HeroSection } from './_components/hero-section';
import { WhyAdoptSection } from './_components/why-adopt-section';
import { Skeleton } from '@/components/ui/skeleton';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex flex-col">
        <Skeleton className="h-[80vh] w-full" />
        <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
           <Skeleton className="h-8 w-1/3 mx-auto mb-8" />
           <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="text-center flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="text-center flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <WhyAdoptSection />
    </>
  );
}
