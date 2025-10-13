
import { Button } from "@/components/ui/button";
import { getHomeUserStories } from "@/lib/actions";
import { HomeUserStory } from "@/lib/data";
import { ArrowRight, BookHeart } from "lucide-react";
import Link from "next/link";
import { HomeStoryCard } from "./home-story-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export async function HomeStoriesSection() {
    let stories: HomeUserStory[] = [];
    let error: string | null = null;

    try {
        stories = await getHomeUserStories();
    } catch (e: any) {
        error = e.message || "Failed to load stories.";
    }

    return (
        <section className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold font-headline">Success Stories</h2>
                    <Button asChild variant="ghost">
                        <Link href="/stories">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error Loading Stories</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!error && stories.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-center p-8 h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                        <BookHeart className="h-12 w-12 mb-4" />
                        <h3 className="text-xl font-semibold">No Stories to Share Yet</h3>
                        <p className="mt-2 max-w-md">Be the first to share your adoption story and inspire others! New stories from our community will appear here.</p>
                    </div>
                )}

                {!error && stories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story) => (
                            <HomeStoryCard key={story.id} story={story} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
