
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HomeUserStory } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { PetTypeIcon } from "@/components/pet-icons";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";

type StoryDialogProps = {
  story: HomeUserStory;
  children: React.ReactNode;
};

export function StoryDialog({ story, children }: StoryDialogProps) {
  const userImage = story.user_image || getRandomDefaultProfileImage(story.user_name);
  const petImage = story.pet_image || getPlaceholderImage(story.pet_type).url;
  const createdAt = parseISO(story.created_at);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="space-y-4">
          {story.pet_image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={petImage}
                alt={story.pet_name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <DialogTitle className="text-3xl font-bold font-headline">{story.title}</DialogTitle>
          <DialogDescription className="!mt-2">
            A story about <span className="font-semibold">{story.pet_name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="my-6">
            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{story.content}</p>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={userImage} alt={story.user_name} />
                    <AvatarFallback>{story.user_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{story.user_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PetTypeIcon typeName={story.pet_type} className="h-4 w-4" />
                        <span>{story.pet_type}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">{format(createdAt, "PPP")}</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
