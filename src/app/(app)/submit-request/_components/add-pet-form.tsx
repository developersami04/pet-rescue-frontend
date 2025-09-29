
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
import { getPetTypes } from '@/lib/action_api';

const addPetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  type: z.string().min(1, 'Pet type is required.'),
  breed: z.string().min(2, 'Breed is required.'),
  age: z.coerce.number().min(0, 'Age must be a positive number.'),
  weight: z.coerce.number().min(0, 'Weight must be a positive number.'),
  size: z.enum(['Small', 'Medium', 'Large']),
  gender: z.enum(['Male', 'Female']),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  image: z
    .any()
    .refine((files) => files?.length === 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});

type PetType = {
  id: number;
  type: string;
};

export function AddPetForm() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);

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
        } catch (error) {
            console.error('Failed to fetch pet types', error);
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not fetch pet types.',
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
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof addPetSchema>) {
    console.log('New pet data submitted:', values);
    toast({
      title: 'Pet Added!',
      description: `${values.name} has been listed for adoption.`,
    });
    form.reset();
    setImagePreview(null);
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
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
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
