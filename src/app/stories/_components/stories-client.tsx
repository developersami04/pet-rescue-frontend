

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
    const [allStories, setAllStories] = useState<UserStory[]>([]);
    const [myStories, setMyStories] = useState<UserStory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMyStoriesLoading, setIsMyStoriesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [myStoriesError, setMyStoriesError] = useState<string | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [activeTab, setActiveTab] = useState('all-stories');
    const { toast } = useToast();
    const router = useRouter();

    const handleAuthError = (e: any) => {
        if (e.message.includes('Session expired')) {
            toast({ variant: 'destructive', title: 'Session Expired' });
            router.push('/login');
        } else {
            return e.message || 'An unknown error occurred.';
        }
    };
    
    const fetchAllStories = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setShowLoginPrompt(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const storiesData = await getUserStories(token);
            setAllStories(storiesData);
        } catch (e: any) {
            const errorMessage = handleAuthError(e);
            if (errorMessage) {
                setError(errorMessage);
                toast({ variant: 'destructive', title: 'Failed to fetch stories', description: errorMessage });
            }
        } finally {
            setIsLoading(false);
        }
    }, [toast, router]);

    const fetchMyStories = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setShowLoginPrompt(true);
            setIsMyStoriesLoading(false);
            return;
        }
        
        setIsMyStoriesLoading(true);
        setMyStoriesError(null);
        try {
            const storiesData = await getUserStories(token, 'my-stories');
            setMyStories(storiesData);
        } catch (e: any) {
            const errorMessage = handleAuthError(e);
            if (errorMessage) {
                setMyStoriesError(errorMessage);
                toast({ variant: 'destructive', title: 'Failed to fetch your stories', description: errorMessage });
            }
        } finally {
            setIsMyStoriesLoading(false);
        }
    }, [toast, router]);

    useEffect(() => {
        fetchAllStories();
    }, [fetchAllStories]);
    
    useEffect(() => {
        if (activeTab === 'my-stories') {
            fetchMyStories();
        }
    }, [activeTab, fetchMyStories]);
    
    if (showLoginPrompt) {
        return <LoginPromptDialog isOpen={showLoginPrompt} />;
    }

    const renderContent = (
        loading: boolean, 
        errorMsg: string | null, 
        stories: UserStory[], 
        emptyTitle: string, 
        emptyDesc: string
    ) => {
        if (loading) {
            return <Loading />;
        }
        if (errorMsg) {
            return (
                <Alert variant="destructive" className="mt-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
            );
        }
        if (stories.length > 0) {
            return (
                <div className="max-w-2xl mx-auto space-y-8 mt-6">
                    {stories.map(story => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                </div>
            );
        }
        return (
            <div className="text-center py-16 col-span-full border-2 border-dashed rounded-lg mt-6">
                <h3 className="text-xl font-semibold">{emptyTitle}</h3>
                <p className="text-muted-foreground mt-2">{emptyDesc}</p>
            </div>
        );
    };

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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="all-stories">Story Feed</TabsTrigger>
                    <TabsTrigger value="my-stories">My Stories</TabsTrigger>
                </TabsList>
                <TabsContent value="all-stories">
                    {renderContent(
                        isLoading, 
                        error, 
                        allStories, 
                        "No stories yet", 
                        "Be the first to share a story about your pet!"
                    )}
                </TabsContent>
                <TabsContent value="my-stories">
                    {renderContent(
                        isMyStoriesLoading, 
                        myStoriesError, 
                        myStories, 
                        "You haven't posted any stories yet", 
                        "Click the \"Post a Story\" button to share your first one."
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

    