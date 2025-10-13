
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth.tsx';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UserStory } from '@/lib/data';
import { getUserStories } from '@/lib/actions';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StoryCard } from './_components/story-card';
import { LoginPromptDialog } from '@/components/login-prompt-dialog';

function StoriesPageSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PageHeader
                title="Pet Stories"
                description="Read heartwarming stories from our community."
            />
            <div className="max-w-2xl mx-auto space-y-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function StoriesClient() {
    const [stories, setStories] = useState<UserStory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

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
        return <StoriesPageSkeleton />;
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

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PageHeader
                title="Pet Stories"
                description="Read heartwarming stories from our community."
            />
            <div className="max-w-2xl mx-auto space-y-8">
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
        </div>
    );
}

export default function StoriesPage() {
    return (
        <Suspense fallback={<StoriesPageSkeleton />}>
            <StoriesClient />
        </Suspense>
    );
}
