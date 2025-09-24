
'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    // Check on initial load
    checkAuthStatus();

    // Listen for storage changes
    window.addEventListener('storage', checkAuthStatus);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  return { isAuthenticated, isLoading };
}
