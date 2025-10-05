
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';
import { sendVerificationEmail } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type VerifyEmailDialogProps = {
    children: React.ReactNode;
}

export function VerifyEmailDialog({ children }: VerifyEmailDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function handleSendVerification() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({ variant: 'destructive', title: 'Authentication Error' });
        return;
    }
    
    setIsSending(true);
    try {
        const result = await sendVerificationEmail(token);
        toast({
            title: 'Verification Email Sent',
            description: result.message || 'Please check your inbox to verify your email address.',
        });
        setIsOpen(false);
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired', description: 'Please log in again.'});
            router.push('/login');
        } else {
            toast({ variant: 'destructive', title: 'Failed to Send', description: error.message });
        }
    } finally {
        setIsSending(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email Address</DialogTitle>
          <DialogDescription>
            Click the button below to send a verification link to your registered email address. This link will be valid for 10 minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-6">
            <MailCheck className="h-16 w-16 text-primary" />
        </div>
        <DialogFooter className="sm:justify-between gap-2">
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button onClick={handleSendVerification} disabled={isSending}>
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Verification Link
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
