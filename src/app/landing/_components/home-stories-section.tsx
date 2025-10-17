
'use client';

import { Button } from "@/components/ui/button";
import { getHomeUserStories } from "@/lib/actions";
import { HomeUserStory } from "@/lib/data";
import { ArrowRight, BookHeart } from "lucide-react";
import Link from "next/link";
import { HomeStoryCard } from "./home-story-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};


export function HomeStoriesSection() {
    const [stories, setStories] = useState<HomeUserStory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStories() {
            setIsLoading(true);
            try {
                const fetchedStories = await getHomeUserStories();
                setStories(fetchedStories);
            } catch (e: any) {
                setError(e.message || "Failed to load stories.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchStories();
    }, []);

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

                {isLoading && <p>Loading stories...</p>}

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error Loading Stories</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!isLoading && !error && stories.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-center p-8 h-64 border-2 border-dashed rounded-lg text-muted-foreground">
                        <BookHeart className="h-12 w-12 mb-4" />
                        <h3 className="text-xl font-semibold">No Stories to Share Yet</h3>
                        <p className="mt-2 max-w-md">Be the first to share your adoption story and inspire others! New stories from our community will appear here.</p>
                    </div>
                )}

                {!isLoading && !error && stories.length > 0 && (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {stories.map((story) => (
                            <HomeStoryCard key={story.id} story={story} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
