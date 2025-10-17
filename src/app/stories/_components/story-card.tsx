
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStory } from "@/lib/data";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, MoreVertical, Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteUserStory } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { UpdateStoryDialog } from "./update-story-dialog";

type StoryCardProps = {
    story: UserStory;
    isMyStory?: boolean;
    onUpdate?: () => void;
};

export function StoryCard({ story, isMyStory = false, onUpdate }: StoryCardProps) {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const userImage = story.user_image || getRandomDefaultProfileImage(story.user);
    const petImage = story.pet_image || getPlaceholderImage('Default').url;

    const createdAt = parseISO(story.created_at);
    const modifiedAt = parseISO(story.modified_at);
    const isEdited = modifiedAt.getTime() - createdAt.getTime() > 1000; // 1 second tolerance

    const isOwner = user?.id === story.user;

    const handleDelete = async () => {
        setIsDeleting(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            setIsDeleting(false);
            return;
        }

        try {
            await deleteUserStory(token, story.id);
            toast({ title: "Story Deleted" });
            if (onUpdate) onUpdate();
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error deleting story", description: error.message });
        } finally {
            setIsDeleting(false);
        }
    }


    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-4">
                <Avatar>
                    <AvatarImage src={userImage} alt={story.username} />
                    <AvatarFallback>{story.username?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle>{story.title}</CardTitle>
                    <CardDescription>
                        By {story.username} • {formatDistanceToNow(createdAt, { addSuffix: true })}
                        {isEdited && <span className="text-muted-foreground text-xs italic"> (edited)</span>}
                    </CardDescription>
                </div>
                {isMyStory && isOwner && (
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                 <UpdateStoryDialog story={story} onUpdate={onUpdate}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Pen className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                </UpdateStoryDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete your story "{story.title}". This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
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
