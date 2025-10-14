
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createUserStory, getMyPets, getFavoritePets } from '@/lib/actions';
import type { Pet, FavoritePet } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const storySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  pet: z.coerce.number().optional().nullable(),
  content: z.string().min(20, 'Story must be at least 20 characters long.'),
});

type SelectablePet = {
    id: number;
    name: string;
}

export function CreateStoryForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isPetListLoading, setIsPetListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectablePets, setSelectablePets] = useState<SelectablePet[]>([]);

  const form = useForm<z.infer<typeof storySchema>>({
    resolver: zodResolver(storySchema),
    defaultValues: {
        title: '',
        content: '',
        pet: null,
    }
  });

  const { isSubmitting } = form.formState;

  const fetchPets = useCallback(async () => {
    setIsPetListLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
        setError('You must be logged in to post a story.');
        setIsPetListLoading(false);
        return;
    }

    try {
        const [myPets, favoritePets] = await Promise.all([
            getMyPets(token),
            getFavoritePets(token),
        ]);

        const petMap = new Map<number, SelectablePet>();

        // Add verified pets from 'my pets'
        myPets?.forEach(pet => {
            if (pet.is_verified) {
                petMap.set(pet.id, { id: pet.id, name: pet.name });
            }
        });

        // Add favorite pets (avoiding duplicates)
        favoritePets.forEach(favPet => {
            if (!petMap.has(favPet.pet_id)) {
                petMap.set(favPet.pet_id, { id: favPet.pet_id, name: favPet.pet_name });
            }
        });
        
        setSelectablePets(Array.from(petMap.values()));

    } catch (e: any) {
        setError(e.message || 'Failed to load pets.');
    } finally {
        setIsPetListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);


  async function onSubmit(values: z.infer<typeof storySchema>) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({ variant: 'destructive', title: 'Authentication Error' });
        return;
    }

    try {
        await createUserStory(token, values.pet, values.title, values.content);
        toast({
            title: 'Story Published!',
            description: `Your story has been successfully published.`,
        });
        router.push('/stories');
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            router.push('/login');
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed to Post Story',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    }
  }

  if (error) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Title</FormLabel>
              <FormControl>
                <Input placeholder="A title for your story" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="pet"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Select a Pet (Optional)</FormLabel>
                <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? null : Number(value))}
                    defaultValue={field.value ? String(field.value) : "none"}
                    disabled={isPetListLoading}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={isPetListLoading ? "Loading pets..." : "Choose a pet for your story"} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {selectablePets.length > 0 && (
                            selectablePets.map(pet => (
                                <SelectItem key={pet.id} value={String(pet.id)}>{pet.name}</SelectItem>
                            ))
                        )}
                         {selectablePets.length === 0 && !isPetListLoading && (
                            <div className="p-4 text-sm text-muted-foreground text-center">No verified or favorite pets found.</div>
                        )}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Story</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Share your adventure...`}
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || isPetListLoading}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Story
            </Button>
        </div>
      </form>
    </Form>
  );
}
