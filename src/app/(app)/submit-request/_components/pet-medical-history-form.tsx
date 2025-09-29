

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
import { Loader2, Upload, CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Pet } from '@/lib/data';
import { getMyPets, submitRequest } from '@/lib/action_api';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const medicalHistorySchema = z.object({
  petId: z.string().min(1, 'Please select a pet.'),
  diseaseName: z.string().min(2, 'Disease name is required.'),
  vaccineName: z.string().min(2, 'Vaccine name is required.'),
  stage: z.string().min(1, 'Stage is required.'),
  years: z.coerce.number().min(0, 'Please enter a valid number of years.'),
  message: z.string().optional(),
  last_vaccinated_date: z.date().optional(),
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
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUserPets() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const myPets = await getMyPets(token);
          setUserPets(myPets);
        } catch (error) {
          console.error("Failed to fetch user's pets:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch your pets. Please try again later.",
          });
        }
      }
    }
    fetchUserPets();
  }, [toast]);

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

  async function onSubmit(values: z.infer<typeof medicalHistorySchema>) {
    setIsSubmitting(true);
     const token = localStorage.getItem('authToken');
    if (!token) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to submit a medical history.',
        });
        setIsSubmitting(false);
        return;
    }

    const payload = {
        pet: parseInt(values.petId),
        disease_name: values.diseaseName,
        stage: parseInt(values.stage),
        no_of_years: values.years,
        vaccination_name: values.vaccineName,
        last_vaccinated_date: values.last_vaccinated_date ? format(values.last_vaccinated_date, 'yyyy-MM-dd') : null,
        message: values.message,
    };

    try {
        const result = await submitRequest(token, 'pet-medical-history', payload);
        toast({
            title: 'Medical History Added!',
            description: result.message || 'The medical record has been submitted.',
        });
        form.reset();
        setImagePreview(null);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
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
              name="petId"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Select Pet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={userPets.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={userPets.length > 0 ? "Select one of your pets" : "You have no pets to select"} />
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
            <FormField
              control={form.control}
              name="diseaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disease Name</FormLabel>
                  <FormControl><Input placeholder="Enter disease name" {...field} /></FormControl>
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
                  <FormControl><Input placeholder="Enter vaccine name" {...field} /></FormControl>
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
                  <FormControl><Input placeholder="Enter stage" {...field} /></FormControl>
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
                  <FormControl><Input type="number" placeholder="Enter years" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DayPicker
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
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
