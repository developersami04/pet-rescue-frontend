
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-3xl grid-rows-[auto,1fr,auto] max-h-[90vh]">
        <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image
                        src={petImage}
                        alt={story.pet_name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="md:col-span-2 flex flex-col h-full">
                <DialogHeader className="space-y-2 text-left">
                    <DialogTitle className="text-2xl font-bold font-headline">{story.title}</DialogTitle>
                    <DialogDescription className="!mt-1">
                        A story about <span className="font-semibold">{story.pet_name}</span>
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="my-4 flex-grow pr-4">
                    <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{story.content}</p>
                </ScrollArea>

                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 mt-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={userImage} alt={story.user_name} />
                            <AvatarFallback>{story.user_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{story.user_name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <PetTypeIcon typeName={story.pet_type} className="h-3 w-3" />
                                <span>{story.pet_type}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">{format(createdAt, "PPP")}</p>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
