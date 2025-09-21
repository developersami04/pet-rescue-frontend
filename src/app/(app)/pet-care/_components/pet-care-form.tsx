"use client";

import { useFormState } from "react-dom";
import { virtualPetCareAssistant } from "@/ai/flows/virtual-pet-care-assistant";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Utensils, Activity, Bath, Stethoscope } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const petCareSchema = z.object({
  petType: z.enum(["dog", "cat", "bird"]),
  petAge: z.coerce.number().min(0, "Age must be a positive number."),
  petBreed: z.string().min(2, "Please enter a breed."),
  ownerLifestyle: z.string().min(10, "Please describe your lifestyle."),
  specificNeeds: z.string().optional(),
});

type PetCareState = {
  careTips?: string;
  feedingSchedule?: string;
  exerciseSchedule?: string;
  groomingSchedule?: string;
  healthTips?: string;
  error?: string;
};

const initialState: PetCareState = {};

export function PetCareForm() {
  const [state, formAction] = useFormState(
    async (
      prevState: PetCareState,
      formData: FormData
    ): Promise<PetCareState> => {
      const data = Object.fromEntries(formData.entries());
      const parsed = petCareSchema.safeParse(data);

      if (!parsed.success) {
        return { error: "Invalid form data provided." };
      }

      try {
        const result = await virtualPetCareAssistant(parsed.data);
        return result;
      } catch (e: any) {
        return { error: e.message || "An unknown error occurred." };
      }
    },
    initialState
  );

  const form = useForm<z.infer<typeof petCareSchema>>({
    resolver: zodResolver(petCareSchema),
    defaultValues: {
      petAge: 0,
      petBreed: "",
      ownerLifestyle: "",
      specificNeeds: "",
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Your Pet's Profile</CardTitle>
            <CardDescription>
              Provide details about your pet for tailored advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form action={formAction} className="space-y-6">
                <FormField
                  control={form.control}
                  name="petType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pet type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="petAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Age (years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="petBreed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Labrador, Siamese" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerLifestyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Lifestyle</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Active, busy schedule, work from home..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specificNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Needs (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Allergies, anxiety, recent surgery..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get Care Plan
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {isSubmitting &&
            [...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-1/3 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-5/6 bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}

          {state?.error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {!isSubmitting && !state?.careTips && !state?.error && (
            <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
                <div className="p-4 bg-muted rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Your Pet's Care Plan</h3>
                <p className="text-muted-foreground">Fill out the form to generate a personalized plan.</p>
            </Card>
          )}

          {state?.careTips && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent"/>Care Tips</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>{state.careTips}</p>
              </CardContent>
            </Card>
          )}
          {state?.feedingSchedule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5 text-accent"/>Feeding Schedule</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: state.feedingSchedule.replace(/\n/g, '<br />') }} />
            </Card>
          )}
          {state?.exerciseSchedule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-accent"/>Exercise Schedule</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: state.exerciseSchedule.replace(/\n/g, '<br />') }} />
            </Card>
          )}
          {state?.groomingSchedule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bath className="w-5 h-5 text-accent"/>Grooming Schedule</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: state.groomingSchedule.replace(/\n/g, '<br />') }} />
            </Card>
          )}
          {state?.healthTips && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5 text-accent"/>Health Tips</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                 <p>{state.healthTips}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
