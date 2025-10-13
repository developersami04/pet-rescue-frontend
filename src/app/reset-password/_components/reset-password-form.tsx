
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { confirmPasswordReset } from '@/lib/actions';

const resetPasswordSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 characters.').max(6, 'OTP must be 6 characters.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});


export function ResetPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirm_password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!email) {
        toast({
            variant: 'destructive',
            title: 'Missing Email',
            description: 'The email address is missing from the request. Please try the "Forgot Password" process again.',
        });
        return;
    }
    setIsSubmitting(true);
    try {
      await confirmPasswordReset(values.otp, values.password, values.confirm_password, email);
      toast({
        title: 'Password Reset Successful',
        description: 'You can now log in with your new password.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reset Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Reset Code</FormLabel>
                <FormControl>
                    <Input placeholder="Enter the 6-digit code" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </Form>
  );
}
