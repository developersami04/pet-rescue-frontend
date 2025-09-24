
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

type FeedItemProps = {
    event: FeedEvent;
}

export function FeedItem({ event }: FeedItemProps) {
    const { icon: Icon } = event;
    const timeAgo = formatDistanceToNow(event.timestamp, { addSuffix: true });

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-4 p-4">
                <div className="flex-shrink-0">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-primary/10", 
                        event.type === 'adoption' && "bg-destructive/10",
                        event.type === 'new-user' && "bg-accent/10"
                    )}>
                        <Icon className={cn("h-5 w-5 text-primary",
                            event.type === 'adoption' && "text-destructive",
                            event.type === 'new-user' && "text-accent-foreground"
                        )} />
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
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                         <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                            data-ai-hint={event.imageHint}
                        />
                    </div>
                )}
                 {event.petId && (
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={`/pets/${event.petId}`}>
                            {event.type === 'new-pet' ? 'View Profile' : `See ${event.title.split(' ')[0]}'s story`}
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
