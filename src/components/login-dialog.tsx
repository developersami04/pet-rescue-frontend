
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { loginUser } from '@/lib/actions';
import { useAuth } from '@/lib/auth.tsx';
import { useState } from 'react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginDialogProps = {
    children: React.ReactNode;
}

export function LoginDialog({ children }: LoginDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const result = await loginUser(values);
      
      if (!result.success) {
        let title = 'Login Failed';
        let description = result.error || 'An unknown error occurred.';

        if (result.status === 401) {
            description = 'Invalid credentials. Please check your username and password.';
        } else if (result.status === 403) {
            description = 'This account is inactive. Please contact support.';
        }

        toast({
            variant: 'destructive',
            title: title,
            description: description,
        });
        return;
      }

      login(result.access_token, result.refresh_token, result.user, result.message);
      
      // Full page refresh to ensure all state is reset
      window.location.assign('/');

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
                <DialogTitle className="text-2xl">Login</DialogTitle>
                <DialogDescription>Enter your credentials to access your account.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your username" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex items-center justify-between">
                    <div />
                    <Link href="/forgot-password" onClick={() => setIsOpen(false)} passHref className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/create-account" onClick={() => setIsOpen(false)} className="font-semibold text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
