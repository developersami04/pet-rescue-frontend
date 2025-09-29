
'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/user-data';
import { getUserDetails } from '@/lib/action_api';

export function useUserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserDetails() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found.');
        setIsLoading(false);
        return;
      }

      try {
        const userDetails = await getUserDetails(token);
        setUser(userDetails);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch user details.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDetails();
  }, []);

  return { user, isLoading, error };
}
