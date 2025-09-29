
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
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { updateUserDetails } from '@/lib/action_api';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/data';
import Image from 'next/image';

const profilePictureSchema = z.object({
  profile_image: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});

type ChangeProfilePictureDialogProps = {
    children: React.ReactNode;
    user: User;
    onUpdate: () => void;
}

export function ChangeProfilePictureDialog({ children, user, onUpdate }: ChangeProfilePictureDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof profilePictureSchema>>({
    resolver: zodResolver(profilePictureSchema),
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof profilePictureSchema>) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to update your profile picture.',
        });
        return;
    }
    
    const formData = new FormData();
    formData.append('profile_image', values.profile_image[0]);

    try {
        await updateUserDetails(token, formData);
        toast({
            title: 'Profile Picture Updated',
            description: 'Your new profile picture has been saved.',
        });
        onUpdate();
        setIsOpen(false);
        setImagePreview(null);
        form.reset();
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            toast({
                variant: 'destructive',
                title: 'Session Expired',
                description: 'Please log in again to continue.',
            });
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.dispatchEvent(new Event('storage'));
            router.push('/login');
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message || 'An unexpected error occurred.',
            });
        }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
            setImagePreview(null);
        }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new image to update your profile picture.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="profile_image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>New Profile Image</FormLabel>
                   <FormControl>
                     <div className="relative w-full h-48 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="New profile preview" fill className="object-cover rounded-lg" />
                                <label htmlFor="picture-upload" className="absolute inset-0 cursor-pointer"></label>
                            </>
                        ) : (
                             <div className="text-center space-y-2 text-muted-foreground cursor-pointer p-4">
                                <UploadCloud className="mx-auto h-10 w-10" />
                                <p className="text-sm">Click to upload or drag and drop</p>
                                <p className="text-xs">PNG, JPG, or WEBP (max 5MB)</p>
                             </div>
                        )}
                        <Input
                            id="picture-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => {
                                onChange(e.target.files);
                                handleImageChange(e);
                            }}
                            {...rest}
                        />
                     </div>
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
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

