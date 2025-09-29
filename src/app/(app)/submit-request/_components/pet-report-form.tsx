

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { Pet } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { getMyPets, submitRequest } from '@/lib/action_api';
import { useRouter } from 'next/navigation';

const reportSchema = z.object({
  reportType: z.enum(['lost', 'found'], {
    required_error: 'You need to select a report type.',
  }),
  petId: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  image: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});

export function PetReportForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [reportType, setReportType] = useState<'lost' | 'found' | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUserPets() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const myPets = await getMyPets(token);
          setUserPets(myPets);
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
                console.error("Failed to fetch user's pets:", error);
            }
        }
      }
    }
    if (reportType === 'lost') {
      fetchUserPets();
    }
  }, [reportType, router, toast]);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    if (values.reportType === 'lost' && !values.petId) {
        form.setError('petId', { message: 'Please select which pet is lost.'});
        return;
    }
    // API requires an image for found pets, but the form field is optional.
    // Let's enforce it here if it's a 'found' report
    if (values.reportType === 'found' && (!values.image || values.image.length === 0)) {
        form.setError('image', { message: 'Please upload an image of the pet you found.' });
        return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
     if (!token) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to submit a report.',
        });
        setIsSubmitting(false);
        return;
    }

    const payload = {
        pet: parseInt(values.petId!),
        pet_status: values.reportType,
        message: values.message,
    };

    try {
        const result = await submitRequest(token, 'pet-report', payload);
        toast({
            title: 'Report Submitted!',
            description: result.message || `Your ${values.reportType} pet report has been submitted.`,
        });
        form.reset();
        setReportType(undefined);
        setImagePreview(null);
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
                title: 'Submission Failed',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
        <FormField
          control={form.control}
          name="reportType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Report Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setReportType(value as 'lost' | 'found');
                  }}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="lost" />
                    </FormControl>
                    <FormLabel className="font-normal">I lost my pet</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="found" />
                    </FormControl>
                    <FormLabel className="font-normal">I found a pet</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                {reportType === 'lost' && (
                    <FormField
                        control={form.control}
                        name="petId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Which pet is lost?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={userPets.length === 0}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder={userPets.length > 0 ? "Select one of your pets" : "You have no pets to report"} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {userPets.map(pet => (
                                <SelectItem key={pet.id} value={pet.id.toString()}>{pet.name}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
                
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder={
                                reportType === 'lost' 
                                ? "Describe where and when you last saw your pet." 
                                : "Describe the pet you found and where you found it."
                            }
                            className="resize-none"
                            rows={reportType === 'found' ? 10 : 6}
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            {reportType === 'found' && (
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                                <FormLabel>Image of Found Pet</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/webp"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        {...rest}
                                        onChange={(e) => {
                                            onChange(e.target.files);
                                            handleImageChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Card className="aspect-square">
                        <CardContent className="p-2 h-full">
                            {imagePreview ? (
                                <div className="relative h-full w-full">
                                    <Image src={imagePreview} alt="Found pet preview" fill className="object-cover rounded-md" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-md">
                                    <Upload className="h-12 w-12" />
                                    <p className="mt-2 text-sm text-center">Image Preview</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>


        <Button type="submit" disabled={isSubmitting || !reportType}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Report
        </Button>
      </form>
    </Form>
  );
}
