'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

const petMatchingSchema = z.object({
  lifestyle: z
    .string()
    .min(10, 'Please describe your lifestyle in a bit more detail.'),
  preferences: z
    .string()
    .min(10, 'Please describe your preferences in a bit more detail.'),
});

type PetMatchingFormProps = {
  formAction: (payload: FormData) => void;
};

export function PetMatchingForm({ formAction }: PetMatchingFormProps) {
  const form = useForm<z.infer<typeof petMatchingSchema>>({
    resolver: zodResolver(petMatchingSchema),
    defaultValues: {
      lifestyle: '',
      preferences: '',
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Describe Your Perfect Pet</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <FormField
              control={form.control}
              name="lifestyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Lifestyle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your daily routine, living situation, and activity level."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include details about your home, activity level, and
                    schedule.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your ideal pet's characteristics (e.g., size, energy level, temperament)."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mention desired breed, age, size, temperament, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Find My Match
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
