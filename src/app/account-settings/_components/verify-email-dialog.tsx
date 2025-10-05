
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';
import { sendVerificationEmail, verifyOtp } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useUserDetails } from '@/hooks/use-user-details';

type VerifyEmailDialogProps = {
    children: React.ReactNode;
}

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 characters.').max(6, 'OTP must be 6 characters.'),
});

type VerificationStep = 'initial' | 'otp_sent' | 'verifying' | 'success';

export function VerifyEmailDialog({ children }: VerifyEmailDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { refreshUserDetails } = useUserDetails();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState<VerificationStep>('initial');

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });
  
  const { isSubmitting } = form.formState;

  const resetState = () => {
    setIsSending(false);
    setStep('initial');
    form.reset();
  }

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
            title: 'Verification Code Sent',
            description: result.message || 'Please check your inbox for the OTP.',
        });
        setStep('otp_sent');
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

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({ variant: 'destructive', title: 'Authentication Error' });
        return;
    }
    
    try {
        const result = await verifyOtp(token, values.otp);
        toast({ title: 'Email Verified!', description: result.message });
        refreshUserDetails();
        setIsOpen(false);
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired', description: 'Please log in again.'});
            router.push('/login');
        } else {
            toast({ variant: 'destructive', title: 'Verification Failed', description: error.message });
        }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if(!open) {
            resetState();
        }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email Address</DialogTitle>
           <DialogDescription>
            {step === 'initial' && "Click the button below to send a verification code to your email."}
            {step === 'otp_sent' && "A 6-digit code has been sent to your email. Please enter it below."}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'initial' && (
            <>
                <div className="flex items-center justify-center p-6">
                    <MailCheck className="h-16 w-16 text-primary" />
                </div>
                <DialogFooter className="sm:justify-between gap-2">
                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                    <Button onClick={handleSendVerification} disabled={isSending}>
                        {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Verification Code
                    </Button>
                </DialogFooter>
            </>
        )}

        {step === 'otp_sent' && (
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onOtpSubmit)} className="space-y-6 pt-4">
                     <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter 6-digit code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify OTP
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
