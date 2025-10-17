
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UserStory } from '@/lib/data';
import { getUserStories } from '@/lib/actions';
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StoryCard } from './story-card';
import { LoginPromptDialog } from '@/components/login-prompt-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Loading from '../loading';

export function StoriesClient() {
    const [stories, setStories] = useState<UserStory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();

    const fetchStories = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setShowLoginPrompt(true);
            setIsLoading(false);
            return;
        }

        try {
            const storiesData = await getUserStories(token);
            setStories(storiesData);
        } catch (e: any) {
            if (e.message.includes('Session expired')) {
                toast({ variant: 'destructive', title: 'Session Expired' });
                router.push('/login');
            } else {
                setError(e.message || 'Failed to fetch stories.');
                toast({ variant: 'destructive', title: 'Failed to fetch stories' });
            }
        } finally {
            setIsLoading(false);
        }
    }, [toast, router]);

    useEffect(() => {
        fetchStories();
    }, [fetchStories]);
    
    if (showLoginPrompt) {
        return <LoginPromptDialog isOpen={showLoginPrompt} />;
    }


    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6">
                 <PageHeader
                    title="Pet Stories"
                    description="Read heartwarming stories from our community."
                />
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }
    
    const myStories = user ? stories.filter(story => story.user === user.id) : [];

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <PageHeader
                    title="Pet Stories"
                    description="Read heartwarming stories from our community."
                />
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/post-story">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post a Story
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="all-stories" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="all-stories">Story Feed</TabsTrigger>
                    <TabsTrigger value="my-stories">My Stories</TabsTrigger>
                </TabsList>
                <TabsContent value="all-stories">
                    <div className="max-w-2xl mx-auto space-y-8 mt-6">
                        {stories.length > 0 ? (
                            stories.map(story => (
                                <StoryCard key={story.id} story={story} />
                            ))
                        ) : (
                            <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg">
                                <h3 className="text-xl font-semibold">No stories yet</h3>
                                <p className="text-muted-foreground mt-2">
                                    Be the first to share a story about your pet!
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="my-stories">
                     <div className="max-w-2xl mx-auto space-y-8 mt-6">
                        {myStories.length > 0 ? (
                            myStories.map(story => (
                                <StoryCard key={story.id} story={story} />
                            ))
                        ) : (
                            <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg">
                                <h3 className="text-xl font-semibold">You haven't posted any stories yet</h3>
                                <p className="text-muted-foreground mt-2">
                                    Click the "Post a Story" button to share your first one.
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
