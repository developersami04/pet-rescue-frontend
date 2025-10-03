
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
import { updateAdoptionRequest } from '@/lib/actions/pet.actions';
import { useRouter } from 'next/navigation';
import { MyAdoptionRequest } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type UpdateAdoptionRequestDialogProps = {
    request: MyAdoptionRequest;
    onUpdate: () => void;
    children: React.ReactNode;
}

export function UpdateAdoptionRequestDialog({ request, onUpdate, children }: UpdateAdoptionRequestDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: request.message,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({ variant: 'destructive', title: 'Authentication Error' });
        return;
    }

    try {
        await updateAdoptionRequest(token, request.id, values.message);
        toast({ title: 'Request Updated', description: 'Your adoption request message has been updated.' });
        onUpdate();
        setIsOpen(false);
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired', description: 'Please log in again.'});
            router.push('/login');
        } else {
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
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
          <DialogTitle>Update Adoption Request</DialogTitle>
          <DialogDescription>
            Edit your message for the adoption of {request.pet_name}.
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
                    <Textarea rows={5} {...field} />
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
