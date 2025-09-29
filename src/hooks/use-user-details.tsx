
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/data';
import { getUserDetails } from '@/lib/action_api';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

export function useUserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserDetails = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userDetails = await getUserDetails(token);
      setUser(userDetails);
      setError(null);
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
        setError(e.message || 'Failed to fetch user details.');
        toast({
          variant: 'destructive',
          title: 'Failed to fetch user details',
          description: e.message || 'An unexpected error occurred. Please try refreshing the page.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, router]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return { user, isLoading, error, refreshUserDetails: fetchUserDetails };
}
