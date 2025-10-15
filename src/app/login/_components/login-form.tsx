
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { loginUser } from '@/lib/actions';
import { useAuth } from '@/lib/auth.tsx';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);
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
      
      if (result.user?.is_admin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
        // This catch block will now mostly handle unexpected server/network errors
        // since the action returns a structured response for login failures.
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
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
                <Link href="/forgot-password" passHref className="text-sm text-primary hover:underline">
                    Forgot password?
                </Link>
             </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
             <p className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/create-account" className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
