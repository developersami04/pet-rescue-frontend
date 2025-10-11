

'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { checkUserAuth } from './actions';
import { toast } from '@/hooks/use-toast';
import { User } from './data';
import { useRouter } from 'next/navigation';
import { refreshAccessToken } from './api';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
  login: (token: string, refreshToken: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  }, []);

  const verifyAuth = useCallback(async (isLoginEvent = false) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    if (!isLoginEvent) setIsLoading(true);
    
    try {
        const { isAuthenticated: authStatus, user: userData, error, message, newAccessToken } = await checkUserAuth(refreshToken);
        if (authStatus && userData && newAccessToken) {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('authToken', newAccessToken);
            if (isLoginEvent) {
                toast({ title: "Login Successful", description: message });
            }
        } else {
            logout();
             if (error) {
                console.error("Auth check failed:", error);
            }
        }
    } catch (e: any) {
        console.error("Error during auth verification:", e);
        logout();
        if (!isLoginEvent) { 
            toast({
                variant: "destructive",
                title: "Session Expired",
                description: "Please log in again to continue.",
            });
        }
    } finally {
        setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    verifyAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if(e.key === 'authToken' || e.key === null) {
        verifyAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [verifyAuth]);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    // Instead of dispatching event, directly call verifyAuth
    verifyAuth(true);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
