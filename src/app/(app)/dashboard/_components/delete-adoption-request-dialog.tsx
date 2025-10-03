
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { deleteAdoptionRequest } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type DeleteAdoptionRequestDialogProps = {
    requestId: number;
    onDeleted: () => void;
    children: React.ReactNode;
}

export function DeleteAdoptionRequestDialog({ requestId, onDeleted, children }: DeleteAdoptionRequestDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({ variant: 'destructive', title: 'Authentication Error' });
        return;
    }
    
    setIsDeleting(true);
    try {
        await deleteAdoptionRequest(token, requestId);
        toast({ title: 'Request Deleted', description: 'Your adoption request has been successfully deleted.'});
        onDeleted();
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired', description: 'Please log in again.'});
            router.push('/login');
        } else {
            toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message });
        }
    } finally {
        setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your adoption request.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                 {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}
