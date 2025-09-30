
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
import { CalendarIcon, Loader2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getPetTypes, submitRequest } from '@/lib/action_api';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';

const addPetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  pet_type: z.string().min(1, 'Pet type is required.'),
  breed: z.string().optional(),
  age: z.coerce.number().min(0, 'Age must be a positive number.').optional().nullable(),
  weight: z.coerce.number().min(0, 'Weight must be a positive number.').optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Unknown']),
  description: z.string().optional(),
  pet_image: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
  is_vaccinated: z.boolean().default(false),
  is_diseased: z.boolean().default(false),
  available_for_adopt: z.boolean().default(true),
  is_founded: z.boolean().default(false),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.coerce.number().optional().nullable(),
  state: z.string().optional(),
  color: z.string().optional(),

  // Medical History
  disease_name: z.string().optional(),
  stage: z.string().optional(),
  no_of_years: z.coerce.number().optional().nullable(),
  vaccination_name: z.string().optional(),
  last_vaccinated_date: z.date().optional(),
  note: z.string().optional(),

  // Pet Report
  report_image: z.any().optional(),
  pet_status: z.enum(['lost', 'found']).optional(),
  message: z.string().optional(),
});

type PetType = {
  id: number;
  name: string;
};

export function AddPetForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [petImagePreview, setPetImagePreview] = useState<string | null>(null);
  const [reportImagePreview, setReportImagePreview] = useState<string | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  
  const form = useForm<z.infer<typeof addPetSchema>>({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      name: '',
      pet_type: '',
      breed: '',
      age: null,
      weight: null,
      pincode: null,
      description: '',
      is_vaccinated: false,
      is_diseased: false,
      available_for_adopt: false,
      is_founded: false,
      address: '',
      city: '',
      state: '',
      color: '',
      disease_name: '',
      stage: '',
      no_of_years: null,
      vaccination_name: '',
      note: '',
      message: '',
    },
  });
  
  const { isSubmitting } = form.formState;

  useEffect(() => {
    async function fetchPetTypes() {
        try {
            const types = await getPetTypes();
            if (types) {
                setPetTypes(types);
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not fetch pet types.',
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch pet types', error);
             toast({
                variant: 'destructive',
                title: 'Error fetching pet types',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    }
    fetchPetTypes();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof addPetSchema>) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to add a pet.',
        });
        return;
    }
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            if (key === 'pet_image' && value instanceof FileList && value.length > 0) {
                formData.append(key, value[0]);
            } else if (key === 'report_image' && value instanceof FileList && value.length > 0) {
                 formData.append(key, value[0]);
            } else if (key === 'last_vaccinated_date' && value instanceof Date) {
                 formData.append(key, format(value, 'yyyy-MM-dd'));
            } else if (typeof value === 'boolean') {
                 formData.append(key, String(value));
            } else if (key !== 'pet_image' && key !== 'report_image') {
                formData.append(key, String(value));
            }
        }
    });

    try {
        const result = await submitRequest(token, formData);
        toast({
            title: 'Request Submitted!',
            description: result.message || `${values.name} has been submitted.`,
        });
        form.reset();
        setPetImagePreview(null);
        setReportImagePreview(null);
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
                title: 'Failed to add pet',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    }
  }

  const handlePetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetImagePreview(URL.createObjectURL(file));
    } else {
        setPetImagePreview(null);
    }
  };

  const handleReportImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportImagePreview(URL.createObjectURL(file));
    } else {
      setReportImagePreview(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Pet Details Section */}
        <h3 className="text-lg font-medium">Pet Details</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Pet Name</FormLabel><FormControl><Input placeholder="Enter pet name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pet_type" render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={petTypes.length === 0}><FormControl><SelectTrigger><SelectValue placeholder="Select pet type" /></SelectTrigger></FormControl><SelectContent>{petTypes.map(petType => (<SelectItem key={petType.id} value={String(petType.id)}>{petType.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="breed" render={({ field }) => (
                    <FormItem><FormLabel>Breed</FormLabel><FormControl><Input placeholder="Enter breed" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Age (in years)</FormLabel><FormControl><Input type="number" placeholder="Enter age" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem><FormLabel>Weight (in kg)</FormLabel><FormControl><Input type="number" placeholder="Enter weight" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Unknown">Unknown</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="color" render={({ field }) => (
                    <FormItem><FormLabel>Color</FormLabel><FormControl><Input placeholder="Enter color" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="Enter address" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Enter city" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Enter state" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input type="number" placeholder="Enter pincode" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <div className="lg:col-span-1 space-y-4">
                 <FormField control={form.control} name="pet_image" render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem><FormLabel>Pet Image</FormLabel><FormControl><Input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => { onChange(e.target.files); handlePetImageChange(e); }} {...rest} /></FormControl><FormMessage /></FormItem>
                )} />
                <Card className="aspect-square">
                    <CardContent className="p-2 h-full">{petImagePreview ? (<div className="relative h-full w-full"><Image src={petImagePreview} alt="Pet preview" fill className="object-cover rounded-md" /></div>) : (<div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-md"><Upload className="h-12 w-12" /><p className="mt-2 text-sm">Image Preview</p></div>)}</CardContent>
                </Card>
            </div>
        </div>
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Tell us about the pet..." className="resize-none" rows={5} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField control={form.control} name="available_for_adopt" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Available for Adoption</FormLabel></div></FormItem>)} />
            <FormField control={form.control} name="is_founded" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Is this a Found Pet?</FormLabel></div></FormItem>)} />
            <FormField control={form.control} name="is_vaccinated" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Vaccinated?</FormLabel></div></FormItem>)} />
            <FormField control={form.control} name="is_diseased" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Any Diseases?</FormLabel></div></FormItem>)} />
        </div>

        <Separator className="my-8" />
        
        {/* Medical History Section */}
        <h3 className="text-lg font-medium">Medical History (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="disease_name" render={({ field }) => (<FormItem><FormLabel>Disease Name</FormLabel><FormControl><Input placeholder="e.g., Rabies" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="vaccination_name" render={({ field }) => (<FormItem><FormLabel>Vaccine Name</FormLabel><FormControl><Input placeholder="e.g., Anti-Rabies Vaccine" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="stage" render={({ field }) => (<FormItem><FormLabel>Stage</FormLabel><FormControl><Input placeholder="Enter stage" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="no_of_years" render={({ field }) => (<FormItem><FormLabel>Years Since Vaccination</FormLabel><FormControl><Input type="number" placeholder="Enter years" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField
                control={form.control}
                name="last_vaccinated_date"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Last Vaccinated Date</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                            )}
                        >
                            {field.value ? (
                            format(field.value, 'PPP')
                            ) : (
                            <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField control={form.control} name="note" render={({ field }) => (<FormItem><FormLabel>Note</FormLabel><FormControl><Textarea placeholder="Add any additional medical notes..." className="resize-none" rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />

        <Separator className="my-8" />
        
        {/* Report Section */}
        <h3 className="text-lg font-medium">Report Status (Optional)</h3>
         <FormField control={form.control} name="pet_status" render={({ field }) => (
            <FormItem className="space-y-3"><FormLabel>Report Type</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-row space-x-4"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="lost" /></FormControl><FormLabel className="font-normal">Lost</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="found" /></FormControl><FormLabel className="font-normal">Found</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel>Report Message</FormLabel><FormControl><Textarea placeholder="Describe where the pet was lost or found..." className="resize-none" rows={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="space-y-4">
                <FormField control={form.control} name="report_image" render={({ field: { onChange, value, ...rest } }) => (<FormItem><FormLabel>Report Image</FormLabel><FormControl><Input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => { onChange(e.target.files); handleReportImageChange(e); }} {...rest} /></FormControl><FormMessage /></FormItem>)} />
                <Card className="aspect-square"><CardContent className="p-2 h-full">{reportImagePreview ? (<div className="relative h-full w-full"><Image src={reportImagePreview} alt="Report image preview" fill className="object-cover rounded-md" /></div>) : (<div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-md"><Upload className="h-12 w-12" /><p className="mt-2 text-sm text-center">Report Image Preview</p></div>)}</CardContent></Card>
            </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
        </Button>
      </form>
    </Form>
  );
}

    