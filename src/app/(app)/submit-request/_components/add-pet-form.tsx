
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
import { Loader2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getPetTypes, submitRequest } from '@/lib/action_api';

const addPetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  type: z.string().min(1, 'Pet type is required.'),
  breed: z.string().min(2, 'Breed is required.'),
  age: z.coerce.number().min(0, 'Age must be a positive number.').nullable(),
  weight: z.coerce.number().min(0, 'Weight must be a positive number.').nullable(),
  size: z.enum(['Small', 'Medium', 'Large']),
  gender: z.enum(['Male', 'Female']),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  image: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
  is_vaccinated: z.boolean().default(false),
  is_diseased: z.boolean().default(false),
  city: z.string().optional(),
  pincode: z.coerce.number().optional().nullable(),
  state: z.string().optional(),
  color: z.string().optional(),
});

type PetType = {
  id: number;
  type: string;
};

export function AddPetForm() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const form = useForm<z.infer<typeof addPetSchema>>({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      name: '',
      type: '',
      breed: '',
      age: 0,
      weight: 0,
      description: '',
      is_vaccinated: false,
      is_diseased: false,
    },
  });

  async function onSubmit(values: z.infer<typeof addPetSchema>) {
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to add a pet.',
        });
        setIsSubmitting(false);
        return;
    }
    
    // We don't send the image file directly, API expects `image: null` for now.
    // The API structure for file uploads would need to be different (e.g. multipart/form-data).
    const payload = {
      name: values.name,
      pet_type: parseInt(values.type),
      breed: values.breed,
      age: values.age,
      weight: values.weight,
      size: values.size,
      gender: values.gender,
      description: values.description,
      image: null, 
      available_for_adopt: true, 
      is_vaccinated: values.is_vaccinated,
      is_diseased: values.is_diseased,
      city: values.city,
      pincode: values.pincode,
      state: values.state,
      color: values.color,
      address: null, // API schema says address can be null
    };

    try {
        const result = await submitRequest(token, 'add-pet', payload);
        toast({
            title: 'Pet Added!',
            description: result.message || `${values.name} has been listed for adoption.`,
        });
        form.reset();
        setImagePreview(null);
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Failed to add pet',
            description: error.message || 'An unexpected error occurred.',
        });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pet Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter pet name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={petTypes.length === 0}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select pet type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {petTypes.map(petType => (
                                <SelectItem key={petType.id} value={String(petType.id)}>
                                    {petType.type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter breed" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Age (in years)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Enter age" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Weight (in kg)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Enter weight" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Small">Small</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Large">Large</SelectItem>
                        </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter color" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter city" {...field} />
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
                        <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Enter pincode" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className="lg:col-span-1 space-y-4">
                 <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                            <FormLabel>Pet Image</FormLabel>
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
                                <Image src={imagePreview} alt="Pet preview" fill className="object-cover rounded-md" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-md">
                                <Upload className="h-12 w-12" />
                                <p className="mt-2 text-sm">Image Preview</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about the pet..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Pet
        </Button>
      </form>
    </Form>
  );
}
