
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
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { AdoptionRequest } from '@/lib/data';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type NotifyUserDialogProps = {
    request: AdoptionRequest;
    action: 'approved' | 'rejected';
    onConfirm: (message: string) => void;
    isUpdating: boolean;
    children: React.ReactNode;
};

export function NotifyUserDialog({ request, action, onConfirm, isUpdating, children }: NotifyUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = action === 'approved' 
    ? `Congratulations! Your adoption request for ${request.pet_name} has been approved. Please contact the owner to arrange the next steps.`
    : `We're sorry, but your adoption request for ${request.pet_name} has been rejected. We encourage you to browse other available pets.`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: defaultMessage,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onConfirm(values.message);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notify {request.requester_name}</DialogTitle>
          <DialogDescription>
            You are about to <span className={cn("font-semibold", action === 'approved' ? "text-green-600" : "text-red-600")}>{action}</span> the request for {request.pet_name}. You can customize the notification message below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Message</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdating} variant={action === 'approved' ? 'default' : 'destructive'}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm & Send Notification
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
