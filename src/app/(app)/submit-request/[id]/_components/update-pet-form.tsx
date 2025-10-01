
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
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getPetTypes, getPetRequestFormData, updatePetRequest } from '@/lib/action_api';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';

const updatePetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  pet_type: z.coerce.number().min(1, 'Pet type is required.'),
  breed: z.string().optional(),
  age: z.coerce.number().min(0, 'Age must be a positive number.').optional().nullable(),
  weight: z.coerce.number().min(0, 'Weight must be a positive number.').optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Unknown'], { required_error: 'Gender is required.' }),
  description: z.string().optional(),
  pet_image: z.any().optional(),
  is_vaccinated: z.boolean().default(false),
  is_diseased: z.boolean().default(false),
  available_for_adopt: z.boolean().default(true),
  is_founded: z.boolean().default(false),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.coerce.number().optional().nullable(),
  state: z.string().optional(),
  color: z.string().min(1, 'Color is required.'),

  disease_name: z.string().optional().transform(e => e === '' ? null : e),
  stage: z.string().optional().transform(e => e === '' ? null : e),
  no_of_years: z.coerce.number().optional().nullable(),
  vaccination_name: z.string().optional().transform(e => e === '' ? null : e),
  last_vaccinated_date: z.date().optional().nullable(),
  note: z.string().optional().transform(e => e === '' ? null : e),

  report_image: z.any().optional(),
  pet_status: z.enum(['lost', 'found']).optional(),
  message: z.string().optional(),
});

type PetType = {
  id: number;
  name: string;
};

type UpdatePetFormProps = {
  petId: string;
};

function getChangedValues(initialValues: any, currentValues: any): Partial<any> {
    const changedValues: Partial<any> = {};
    for (const key in currentValues) {
        if (key === 'pet_image' || key === 'report_image') continue;

        const initialValue = initialValues[key];
        const currentValue = currentValues[key];
        
        const initialString = initialValue instanceof Date ? format(new Date(initialValue), 'yyyy-MM-dd') : String(initialValue ?? '');
        const currentString = currentValue instanceof Date ? format(currentValue, 'yyyy-MM-dd') : String(currentValue ?? '');

        if (initialString !== currentString) {
             if (currentValue === null || currentValue === '') {
                 changedValues[key] = null;
             } else {
                changedValues[key] = currentValue;
             }
        }
    }
    return changedValues;
}


export function UpdatePetForm({ petId }: UpdatePetFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [petImagePreview, setPetImagePreview] = useState<string | null>(null);
  const [reportImagePreview, setReportImagePreview] = useState<string | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [initialData, setInitialData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof updatePetSchema>>({
    resolver: zodResolver(updatePetSchema),
    defaultValues: {
      name: '',
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
      last_vaccinated_date: null,
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
        if (types) setPetTypes(types);
      } catch (error) {
        console.error('Failed to fetch pet types', error);
      }
    }
    fetchPetTypes();
  }, []);

  const fetchPetData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ variant: 'destructive', title: 'Authentication Error' });
      router.push('/login');
      return;
    }
    try {
      setIsLoading(true);
      const data = await getPetRequestFormData(token, petId);
      const formData = {
        ...data,
        last_vaccinated_date: data.last_vaccinated_date ? parseISO(data.last_vaccinated_date) : null,
      };
      form.reset(formData);
      setInitialData(formData);
      if (data.pet_image) setPetImagePreview(data.pet_image);
      if (data.report_image) setReportImagePreview(data.report_image);
    } catch (error: any) {
      if (error.message.includes('You are not the owner of this pet.')) {
        toast({ variant: 'destructive', title: 'Unauthorized', description: "You can only edit pets you own." });
        router.push('/dashboard');
      } else {
        toast({ variant: 'destructive', title: 'Failed to load pet data', description: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  }, [petId, form, router, toast]);

  useEffect(() => {
    fetchPetData();
  }, [fetchPetData]);

  async function onSubmit(values: z.infer<typeof updatePetSchema>) {
    const token = localStorage.getItem('authToken');
    if (!token || !initialData) {
      toast({ variant: 'destructive', title: 'Authentication Error' });
      return;
    }

    const changedValues = getChangedValues(initialData, values);
    const petImageFile = values.pet_image instanceof FileList && values.pet_image.length > 0 ? values.pet_image[0] : null;
    const reportImageFile = values.report_image instanceof FileList && values.report_image.length > 0 ? values.report_image[0] : null;

    if (Object.keys(changedValues).length === 0 && !petImageFile && !reportImageFile) {
      toast({ title: 'No Changes Detected', description: 'You have not made any changes.' });
      return;
    }

    const formData = new FormData();
    formData.append('pet_id', petId);

    Object.entries(changedValues).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, format(value, 'yyyy-MM-dd'));
      } else if (typeof value === 'boolean') {
        formData.append(key, String(value));
      } else if (value === null) {
        formData.append(key, '');
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (petImageFile) {
        formData.append('pet_image', petImageFile);
    }
    if (reportImageFile) {
        formData.append('report_image', reportImageFile);
    }

    try {
      const result = await updatePetRequest(token, formData);
      toast({ title: 'Request Updated!', description: result.message || `Your request for ${values.name} has been updated.` });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    }
  }

  const handlePetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPetImagePreview(file ? URL.createObjectURL(file) : initialData?.pet_image || null);
  };

  const handleReportImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setReportImagePreview(file ? URL.createObjectURL(file) : initialData?.report_image || null);
  };
  
    if (isLoading) {
        return (
            <div className="space-y-8">
                 <h3 className="text-lg font-medium"><Skeleton className="h-6 w-1/4" /></h3>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                    <div className="lg:col-span-1 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="aspect-square w-full" />
                    </div>
                </div>
                 <Skeleton className="h-24 w-full" />
            </div>
        );
    }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <h3 className="text-lg font-medium">Pet Details</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Pet Name</FormLabel><FormControl><Input placeholder="Enter pet name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pet_type" render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel><Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value ?? '')} disabled={petTypes.length === 0}><FormControl><SelectTrigger><SelectValue placeholder="Select pet type" /></SelectTrigger></FormControl><SelectContent>{petTypes.map(petType => (<SelectItem key={petType.id} value={String(petType.id)}>{petType.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="breed" render={({ field }) => (
                    <FormItem><FormLabel>Breed</FormLabel><FormControl><Input placeholder="Enter breed" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>Age (in years)</FormLabel><FormControl><Input type="number" placeholder="Enter age" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem><FormLabel>Weight (in kg)</FormLabel><FormControl><Input type="number" placeholder="Enter weight" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Unknown">Unknown</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="color" render={({ field }) => (
                    <FormItem><FormLabel>Color</FormLabel><FormControl><Input placeholder="Enter color" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="Enter address" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Enter city" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Enter state" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
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
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Tell us about the pet..." className="resize-none" rows={5} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField control={form.control} name="available_for_adopt" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Available for Adoption</FormLabel></div></FormItem>)} />
            <FormField control={form.control} name="is_founded" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Is this a Found Pet?</FormLabel></div></FormItem>)} />
            <FormField control={form.control} name="is_vaccinated" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Vaccinated?</FormLabel></div></FormItem>)} />
            <FormField control={form.control} name="is_diseased" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Any Diseases?</FormLabel></div></FormItem>)} />
        </div>

        <Separator className="my-8" />
        
        <h3 className="text-lg font-medium">Medical History (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="disease_name" render={({ field }) => (<FormItem><FormLabel>Disease Name</FormLabel><FormControl><Input placeholder="e.g., Rabies" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="vaccination_name" render={({ field }) => (<FormItem><FormLabel>Vaccine Name</FormLabel><FormControl><Input placeholder="e.g., Anti-Rabies Vaccine" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="stage" render={({ field }) => (<FormItem><FormLabel>Stage</FormLabel><FormControl><Input placeholder="Enter stage" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="no_of_years" render={({ field }) => (<FormItem><FormLabel>Years Since Vaccination</FormLabel><FormControl><Input type="number" placeholder="Enter years" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            <FormField
                control={form.control}
                name="last_vaccinated_date"
                render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Last Vaccinated Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                        {field.value ? (format(field.value, 'PPP')) : (<span>Pick a date</span>)}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                </PopoverContent></Popover><FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField control={form.control} name="note" render={({ field }) => (<FormItem><FormLabel>Note</FormLabel><FormControl><Textarea placeholder="Add any additional medical notes..." className="resize-none" rows={4} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />

        <Separator className="my-8" />
        
        <h3 className="text-lg font-medium">Report Status</h3>
         <FormField control={form.control} name="pet_status" render={({ field }) => (
            <FormItem className="space-y-3"><FormLabel>Report Type</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-row space-x-4"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="lost" /></FormControl><FormLabel className="font-normal">Lost</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="found" /></FormControl><FormLabel className="font-normal">Found</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel>Report Message</FormLabel><FormControl><Textarea placeholder="Describe where the pet was lost or found..." className="resize-none" rows={10} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="space-y-4">
                <FormField control={form.control} name="report_image" render={({ field: { onChange, value, ...rest } }) => (<FormItem><FormLabel>Report Image (Optional)</FormLabel><FormControl><Input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => { onChange(e.target.files); handleReportImageChange(e); }} {...rest} /></FormControl><FormMessage /></FormItem>)} />
                <Card className="aspect-square"><CardContent className="p-2 h-full">{reportImagePreview ? (<div className="relative h-full w-full"><Image src={reportImagePreview} alt="Report image preview" fill className="object-cover rounded-md" /></div>) : (<div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-md"><Upload className="h-12 w-12" /><p className="mt-2 text-sm text-center">Report Image Preview</p></div>)}</CardContent></Card>
            </div>
        </div>

        <Button type="submit" disabled={isSubmitting || isLoading}>
            {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Request
        </Button>
      </form>
    </Form>
  );
}

    