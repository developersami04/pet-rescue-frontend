"use client";

import { useFormState } from "react-dom";
import { petMatching } from "@/ai/flows/ai-powered-pet-matching";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const petMatchingSchema = z.object({
  lifestyle: z
    .string()
    .min(10, "Please describe your lifestyle in a bit more detail."),
  preferences: z
    .string()
    .min(10, "Please describe your preferences in a bit more detail."),
});

type PetMatchingState = {
  suggestions?: {
    petId: string;
    name: string;
    breed: string;
    age: string;
    description: string;
    imageUrl: string;
    matchReason: string;
  }[];
  error?: string;
};

const initialState: PetMatchingState = {};

export function PetMatchingForm() {
  const [state, formAction] = useFormState(
    async (
      prevState: PetMatchingState,
      formData: FormData
    ): Promise<PetMatchingState> => {
      const lifestyle = formData.get("lifestyle") as string;
      const preferences = formData.get("preferences") as string;

      try {
        const result = await petMatching({ lifestyle, preferences });
        return result;
      } catch (e: any) {
        return { error: e.message || "An unknown error occurred." };
      }
    },
    initialState
  );

  const form = useForm<z.infer<typeof petMatchingSchema>>({
    resolver: zodResolver(petMatchingSchema),
    defaultValues: {
      lifestyle: "",
      preferences: "",
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <div>
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
                        placeholder="e.g., I live in an apartment and work from home. I enjoy long walks on weekends."
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
                        placeholder="e.g., I'm looking for a small to medium-sized dog that is good with children and doesn't shed much."
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

      {isSubmitting && (
         <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <div className="h-56 bg-muted rounded-t-lg"></div>
                    <CardHeader>
                        <div className="h-6 w-1/2 bg-muted rounded"></div>
                        <div className="h-4 w-3/4 bg-muted rounded mt-2"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-4 w-full bg-muted rounded"></div>
                        <div className="h-4 w-full bg-muted rounded mt-2"></div>
                        <div className="h-4 w-2/3 bg-muted rounded mt-2"></div>
                    </CardContent>
                </Card>
            ))}
         </div>
      )}

      {state?.error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.suggestions && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
            Your Pet Matches
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {state.suggestions.map((pet) => (
              <Card key={pet.petId} className="flex flex-col overflow-hidden">
                <div className="relative h-56 w-full">
                  <Image
                    src={pet.imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    data-ai-hint={`${pet.breed}`}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline tracking-wide">
                    {pet.name}
                  </CardTitle>
                  <CardDescription>
                    {pet.breed} &bull; {pet.age}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {pet.description}
                  </p>
                  <div>
                    <h5 className="text-sm font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" /> Match Reason</h5>
                    <p className="text-sm text-muted-foreground italic">
                      "{pet.matchReason}"
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href={`/pets/${pet.petId}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
