
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HomeUserStory } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { StoryDialog } from "./story-dialog";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";

type HomeStoryCardProps = {
  story: HomeUserStory;
};

export function HomeStoryCard({ story }: HomeStoryCardProps) {
  const petImage = story.pet_image || getPlaceholderImage(story.pet_type).url;

  return (
    <StoryDialog story={story}>
        <Card className="h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                        <AvatarImage src={petImage} alt={story.pet_name} className="object-cover" />
                        <AvatarFallback>{story.pet_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{story.title}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{story.content}</p>
            </CardContent>
            <CardFooter>
                 <p className="text-sm font-medium text-muted-foreground">- {story.user_name}</p>
            </CardFooter>
        </Card>
    </StoryDialog>
  );
}
