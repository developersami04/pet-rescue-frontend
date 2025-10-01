
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useUserDetails } from '@/hooks/use-user-details';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { updateUserDetails } from '@/lib/action_api';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/data';
import { ChangePasswordDialog } from './change-password-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const profileFormSchema = z.object({
    first_name: z.string().min(1, 'First name is required.'),
    last_name: z.string().optional(),
    username: z.string().min(3, 'Username must be at least 3 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    phone_no: z.string().min(10, 'Please enter a valid phone number.').optional().nullable(),
    gender: z.enum(['Male', 'Female', 'Other', 'Prefer Not To Say']).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pin_code: z.coerce.number().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function getChangedValues(
  initialValues: User,
  currentValues: ProfileFormValues
): Partial<ProfileFormValues> {
  const changedValues: Partial<ProfileFormValues> = {};
  const initial = initialValues as any;
  const current = currentValues as any;

  for (const key in current) {
    if (initial[key] !== current[key] && current[key] !== null && current[key] !== '') {
       if (key === 'pin_code' && current[key] !== null) {
        if (Number(initial[key]) !== Number(current[key])) {
          changedValues[key as keyof ProfileFormValues] = Number(current[key]) as any;
        }
      } else if (initial[key] !== current[key]) {
        changedValues[key as keyof ProfileFormValues] = current[key];
      }
    }
  }
  
  return changedValues;
}


function ProfileFormSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                 <Skeleton className="h-10 w-28" />
                 <Skeleton className="h-10 w-36" />
            </CardFooter>
        </Card>
    )
}

export function ProfileForm() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, isLoading, error, refreshUserDetails } = useUserDetails();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            phone_no: '',
            address: '',
            city: '',
            state: '',
            pin_code: null
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                phone_no: user.phone_no ?? '',
                gender: user.gender,
                address: user.address ?? '',
                city: user.city ?? '',
                state: user.state ?? '',
                pin_code: user.pin_code,
            });
        }
    }, [user, form]);

    const { isSubmitting } = form.formState;

    async function onSubmit(values: ProfileFormValues) {
        const token = localStorage.getItem('authToken');
        if (!token || !user) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: 'You must be logged in to update your profile.',
            });
            return;
        }

        const changedValues = getChangedValues(user, values);

        if (Object.keys(changedValues).length === 0) {
            toast({
                title: 'No Changes Detected',
                description: 'You have not made any changes to your profile.',
            });
            return;
        }

        try {
            const result = await updateUserDetails(token, changedValues);
            toast({
                title: 'Profile Updated',
                description: result.message || 'Your changes have been saved successfully.',
            });
            refreshUserDetails(); // Refresh user details to get the latest data
        } catch (error: any) {
            if (error.message.includes('Session expired')) {
                toast({
                    variant: 'destructive',
                    title: 'Session Expired',
                    description: 'Please log in again to continue.',
                });
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.dispatchEvent(new Event('storage'));
                router.push('/login');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Update Failed',
                    description: error.message || 'An unexpected error occurred.',
                });
            }
        }
    }

    if (isLoading) {
        return <ProfileFormSkeleton />
    }

     if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information here.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        {user && !user.is_verified && (
                                            <Button type="button" variant="secondary" size="sm">Verify</Button>
                                        )}
                                    </div>
                                    {user && !user.is_verified && (
                                        <div className="pt-1">
                                            <Badge variant="destructive">
                                                <AlertCircle className="mr-1 h-3 w-3" />
                                                Not Verified
                                            </Badge>
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="phone_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                        <SelectItem value="Prefer Not To Say">Prefer Not To Say</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pin_code"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Pin Code</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                         <ChangePasswordDialog />
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

    