
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStory } from "@/lib/data";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type StoryCardProps = {
    story: UserStory;
};

export function StoryCard({ story }: StoryCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const userImage = story.user_image || getRandomDefaultProfileImage(story.user);
    const petImage = story.pet_image || getPlaceholderImage('Default').url;

    const createdAt = parseISO(story.created_at);
    const modifiedAt = parseISO(story.modified_at);
    const isEdited = modifiedAt.getTime() - createdAt.getTime() > 1000; // 1 second tolerance

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                    <AvatarImage src={userImage} alt={story.username} />
                    <AvatarFallback>{story.username?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{story.title}</CardTitle>
                    <CardDescription>
                        By {story.username} • {formatDistanceToNow(createdAt, { addSuffix: true })}
                        {isEdited && <span className="text-muted-foreground text-xs italic"> (edited)</span>}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 {story.pet_image && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                        <Image src={petImage} alt="Pet in story" fill className="object-cover" />
                    </div>
                 )}
                 <p className="text-muted-foreground whitespace-pre-wrap">{story.content}</p>
            </CardContent>
            <CardFooter>
                 <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={cn("mr-2 h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                    Like
                </Button>
            </CardFooter>
        </Card>
    );
}
