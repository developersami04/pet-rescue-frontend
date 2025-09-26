
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
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { pets } from '@/lib/data'; // Using demo data

const reportSchema = z.object({
  reportType: z.enum(['Lost', 'Found'], {
    required_error: 'You need to select a report type.',
  }),
  petId: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export function PetReportForm() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<'Lost' | 'Found' | undefined>();

  // Demo user's pets - in a real app, this would be fetched
  const userPets = pets.slice(1, 4);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof reportSchema>) {
    if (values.reportType === 'Lost' && !values.petId) {
        form.setError('petId', { message: 'Please select which pet is lost.'});
        return;
    }
    console.log('Pet report submitted:', values);
    toast({
      title: 'Report Submitted',
      description: `Your ${values.reportType.toLowerCase()} pet report has been submitted.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
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
                    setReportType(value as 'Lost' | 'Found');
                  }}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Lost" />
                    </FormControl>
                    <FormLabel className="font-normal">I lost my pet</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Found" />
                    </FormControl>
                    <FormLabel className="font-normal">I found a pet</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {reportType === 'Lost' && (
             <FormField
              control={form.control}
              name="petId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which pet is lost?</FormLabel>
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
                    reportType === 'Lost' 
                    ? "Describe where and when you last saw your pet, and any other relevant details." 
                    : "Describe the pet you found, where you found it, and how to contact you."
                  }
                  className="resize-none"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Report
        </Button>
      </form>
    </Form>
  );
}
