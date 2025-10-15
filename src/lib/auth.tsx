
'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { checkUserAuth } from './actions';
import { toast } from '@/hooks/use-toast';
import { User } from './data';
import API_ENDPOINTS from './endpoints';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  isAdmin: boolean | null;
  logout: () => void;
  login: (token: string, refreshToken: string, user: User, message?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 15 minutes in milliseconds
const REFRESH_INTERVAL = 15 * 60 * 1000;

async function silentTokenRefresh() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.refreshToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
        const data = await response.json();
        if (response.ok && data.access_token) {
            localStorage.setItem('authToken', data.access_token);
        } else {
             throw new Error('Failed to refresh token silently');
        }
    } catch (error) {
        console.error("Silent token refresh failed:", error);
        // Don't log out here, let the main auth check handle it
    }
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    const adminStatus = localStorage.getItem('is_admin');
    return adminStatus ? JSON.parse(adminStatus) : null;
  });
  
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('is_admin');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(null);
    window.dispatchEvent(new Event('storage'));
  }, []);

  const verifyAuth = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
        const { isAuthenticated: authStatus, user: userData, error, message, newAccessToken } = await checkUserAuth(refreshToken);
        if (authStatus && userData && newAccessToken) {
            setIsAuthenticated(true);
            setUser(userData);
            setIsAdmin(userData.is_admin);
            localStorage.setItem('authToken', newAccessToken);
            localStorage.setItem('is_admin', String(userData.is_admin));
        } else {
            logout();
             if (error) {
                console.error("Auth check failed:", error);
            }
        }
    } catch (e: any) {
        console.error("Error during auth verification:", e);
        logout();
        toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please log in again to continue.",
        });
    } finally {
        setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    verifyAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if(e.key === 'authToken' || e.key === 'is_admin' || e.key === null) {
        verifyAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    let intervalId: NodeJS.Timeout | undefined;
    if (isAuthenticated) {
        intervalId = setInterval(silentTokenRefresh, REFRESH_INTERVAL);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
       if (intervalId) {
            clearInterval(intervalId);
        }
    };
  }, [isAuthenticated, verifyAuth]);

  const login = (token: string, refreshToken: string, user: User, message?: string) => {
    // Clear previous session data first to ensure a clean state
    logout();

    // Set new session data
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('is_admin', String(user.is_admin));
    
    setIsAuthenticated(true);
    setUser(user);
    setIsAdmin(user.is_admin);
    
    toast({ title: "Login Successful", description: message });

    // This ensures other parts of the app are aware of the change
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, isAdmin, logout, login }}>
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
