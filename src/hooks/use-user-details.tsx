
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/data';
import { getUserDetails } from '@/lib/actions/user.actions';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth.tsx';

export function useUserDetails() {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [isLoading, setIsLoading] = useState(!authUser);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserDetails = useCallback(async () => {
    // If we already have the user from the global context, no need to fetch again initially
    if (authUser) {
      setUser(authUser);
      setIsLoading(false);
      // We still might want to fetch fresh details, so we don't return here.
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      setIsLoading(false);
      return;
    }

    try {
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
        logout();
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
  }, [toast, router, authUser, logout]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return { user, isLoading, error, refreshUserDetails: fetchUserDetails };
}
