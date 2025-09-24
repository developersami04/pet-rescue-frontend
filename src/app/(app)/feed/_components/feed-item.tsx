
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, X } from 'lucide-react';
import { useState } from 'react';

type FeedEvent = {
  id: string;
  type: 'new-pet' | 'adoption' | 'new-user';
  timestamp: Date;
  title: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  icon: React.ElementType;
  petId?: string;
};

type FeedItemProps = {
  event: FeedEvent;
};

export function FeedItem({ event }: FeedItemProps) {
  const { icon: Icon } = event;
  const timeAgo = formatDistanceToNow(event.timestamp, { addSuffix: true });
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start gap-4 p-4">
          <div className="flex-shrink-0">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full bg-primary/10',
                event.type === 'adoption' && 'bg-destructive/10',
                event.type === 'new-user' && 'bg-accent/10'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 text-primary',
                  event.type === 'adoption' && 'text-destructive',
                  event.type === 'new-user' && 'text-accent-foreground'
                )}
              />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-base">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{timeAgo}</p>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <p className="text-sm text-muted-foreground">{event.description}</p>
          {event.imageUrl && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative aspect-video w-full rounded-lg overflow-hidden border block hover:opacity-90 transition-opacity"
              aria-label={`View image for ${event.title} in fullscreen`}
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                data-ai-hint={event.imageHint}
              />
            </button>
          )}
        </CardContent>
        {(event.petId || event.type === 'new-pet') && (
          <CardFooter className="px-4 pb-4 flex items-center gap-2">
            {event.petId && (
              <Button variant="secondary" size="sm" asChild className="flex-grow">
                <Link href={`/pets/${event.petId}`}>
                  {event.type === 'new-pet'
                    ? 'View Profile'
                    : `See ${event.title.split(' ')[0]}'s story`}
                </Link>
              </Button>
            )}
            {event.type !== 'new-user' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                aria-label="Like"
              >
                <Heart
                  className={cn(
                    'h-5 w-5',
                    isLiked && 'fill-destructive text-destructive'
                  )}
                />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
      {isModalOpen && event.imageUrl && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
        >
            <div className="relative max-w-4xl max-h-[80vh] w-full p-4" onClick={(e) => e.stopPropagation()}>
                <Image 
                    src={event.imageUrl} 
                    alt={event.title} 
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                />
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/10 h-10 w-10 rounded-full"
                onClick={() => setIsModalOpen(false)}
            >
                <X className="h-6 w-6" />
                <span className="sr-only">Close image view</span>
            </Button>
        </div>
      )}
    </>
  );
}
