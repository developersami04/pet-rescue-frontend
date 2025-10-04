
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createAdoptionRequest } from '@/lib/actions/pet.actions';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

const adoptionRequestSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type AdoptionRequestDialogProps = {
    petId: number;
    petName: string;
    onUpdate: () => void;
    children: React.ReactNode;
};

export function AdoptionRequestDialog({ petId, petName, onUpdate, children }: AdoptionRequestDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof adoptionRequestSchema>>({
    resolver: zodResolver(adoptionRequestSchema),
    defaultValues: {
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof adoptionRequestSchema>) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to request adoption.',
        });
        return;
    }

    try {
        await createAdoptionRequest(token, petId, values.message);
        toast({
            title: 'Request Sent!',
            description: `Your adoption request for ${petName} has been sent.`,
        });
        onUpdate();
        form.reset();
        setIsOpen(false);
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({
                variant: 'destructive',
                title: 'Session Expired',
                description: 'Please log in again to continue.',
            });
            router.push('/login');
        } else {
            toast({
                variant: 'destructive',
                title: 'Request Failed',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to Adopt {petName}</DialogTitle>
          <DialogDescription>
            Send a message to the owner to express your interest in adopting this pet.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`I would love to give ${petName} a forever home because...`}
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
