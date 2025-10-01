
'use client';

import { PawPrint, Heart, User } from 'lucide-react';
import { FeedItem } from './feed-item';
import { Separator } from '@/components/ui/separator';

const feedEvents = [
  {
    id: '1',
    type: 'new-pet' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    title: 'Buddy is looking for a home!',
    description: 'A playful Golden Retriever puppy just joined us. Full of energy and loves cuddles.',
    imageUrl: 'https://picsum.photos/seed/buddy/600/400',
    imageHint: 'golden retriever',
    icon: PawPrint,
    petId: '1',
  },
  {
    id: '2',
    type: 'adoption' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    title: 'Luna found her forever home!',
    description: 'Great news! Luna the Siamese cat has been adopted by a loving family.',
    imageUrl: 'https://picsum.photos/seed/luna/600/400',
    imageHint: 'siamese cat',
    icon: Heart,
    petId: '4',
  },
  {
    id: '3',
    type: 'new-user' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    title: 'Welcome, Alex!',
    description: 'Alex just joined the Pet-Pal community. Say hello!',
    icon: User,
  },
   {
    id: '4',
    type: 'new-pet' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    title: 'Meet Smokey',
    description: 'A charming grey cat with stunning green eyes is now available for adoption.',
    imageUrl: 'https://picsum.photos/seed/smokey/600/400',
    imageHint: 'grey cat',
    icon: PawPrint,
    petId: '9',
  },
];


export function FeedList() {
  return (
    <div className="space-y-6">
      {feedEvents.map((event) => (
        <FeedItem key={event.id} event={event} />
      ))}
    </div>
  );
}
