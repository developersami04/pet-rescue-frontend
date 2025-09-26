
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
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { pets } from '@/lib/data'; // Using demo data

const medicalHistorySchema = z.object({
  petId: z.string().min(1, 'Please select a pet.'),
  diseaseName: z.string().min(2, 'Disease name is required.'),
  vaccineName: z.string().min(2, 'Vaccine name is required.'),
  stage: z.string().min(2, 'Stage is required.'),
  years: z.coerce.number().min(0, 'Please enter a valid number of years.'),
  message: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});

export function PetMedicalHistoryForm() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Demo user's pets - in a real app, this would be fetched
  const userPets = pets.slice(1, 4);

  const form = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      diseaseName: '',
      vaccineName: '',
      stage: '',
      years: 0,
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof medicalHistorySchema>) {
    console.log('Medical history submitted:', values);
    toast({
      title: 'Medical History Added',
      description: `The record has been added for your pet.`,
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
              name="petId"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Select Pet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select one of your pets" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userPets.map(pet => (
                        <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diseaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disease Name</FormLabel>
                  <FormControl><Input placeholder="Canine Distemper" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vaccineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccine Name</FormLabel>
                  <FormControl><Input placeholder="DHPP" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <FormControl><Input placeholder="Initial" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years Since Vaccination</FormLabel>
                  <FormControl><Input type="number" placeholder="1" {...field} /></FormControl>
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
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      {...rest}
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
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
                    <Image src={imagePreview} alt="Medical record preview" fill className="object-cover rounded-md" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/50 rounded-md">
                    <Upload className="h-12 w-12" />
                    <p className="mt-2 text-sm text-center">Image Preview (Optional)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes or details here..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Medical History
        </Button>
      </form>
    </Form>
  );
}
