
'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, User as UserIcon } from 'lucide-react';
import { viewUserDetails } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type UserDetails = {
    id: number;
    username: string;
    full_name?: string;
    email: string;
    phone_no: string;
    gender: string;
}

type UserDetailsDialogProps = {
    userId: number;
    children: React.ReactNode;
};

function DetailsSkeleton() {
    return (
        <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-48" />
            </div>
             <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
             <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-40" />
            </div>
             <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    )
}

export function UserDetailsDialog({ userId, children }: UserDetailsDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({ variant: 'destructive', title: 'Authentication Error' });
        setError('You are not authenticated.');
        setIsLoading(false);
        return;
    }

    try {
        const result = await viewUserDetails(token, userId);
        setUserDetails(result);
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            router.push('/login');
        } else {
            setError(error.message || 'Could not load user details.');
        }
    } finally {
        setIsLoading(false);
    }
  }, [userId, router, toast]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !userDetails) {
        fetchDetails();
    }
    if (!open) {
        // Reset state when closing to allow re-fetching next time
        setUserDetails(null);
        setError(null);
        setIsLoading(false);
    }
  }

  const displayName = userDetails?.full_name || userDetails?.username;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogDescription>
            Contact information for {isLoading ? '...' : (displayName || 'the user')}.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <DetailsSkeleton />
        ) : error ? (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : userDetails ? (
            <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold">{displayName}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${userDetails.email}`} className="font-semibold hover:underline">{userDetails.email}</a>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                         <a href={`tel:${userDetails.phone_no}`} className="font-semibold hover:underline">{userDetails.phone_no}</a>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-semibold">{userDetails.gender}</p>
                    </div>
                </div>
            </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
