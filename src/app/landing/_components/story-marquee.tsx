
'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PawPrint } from 'lucide-react';

const stories = [
  {
    id: 1,
    user: 'Sarah L.',
    pet: 'Buddy',
    avatar: 'https://picsum.photos/seed/story1/40/40',
    text: 'Adopting Buddy was the best decision ever! He brought so much joy into our home.',
  },
  {
    id: 2,
    user: 'Mike P.',
    pet: 'Luna',
    avatar: 'https://picsum.photos/seed/story2/40/40',
    text: "Luna settled in so quickly. Thank you Petopia for connecting us with our new furry family member.",
  },
  {
    id: 3,
    user: 'Emily C.',
    pet: 'Max',
    avatar: 'https://picsum.photos/seed/story3/40/40',
    text: 'The process was so smooth. We found our perfect companion in Max.',
  },
  {
    id: 4,
    user: 'David H.',
    pet: 'Milo',
    avatar: 'https://picsum.photos/seed/story4/40/40',
    text: "Milo is the most playful cat. We're so grateful to have found him here.",
  },
  {
    id: 5,
    user: 'Jessica A.',
    pet: 'Daisy',
    avatar: 'https://picsum.photos/seed/story5/40/40',
    text: "Our family feels complete with Daisy. She's a wonderful addition.",
  },
  {
    id: 6,
    user: 'Tom R.',
    pet: 'Rocky',
    avatar: 'https://picsum.photos/seed/story6/40/40',
    text: "Rocky has so much energy and love to give. He's my best buddy.",
  },
];

const marqueeVariants = {
  animate: {
    x: [0, -1092],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 25,
        ease: "linear",
      },
    },
  },
};

function StoryItem({ story }: { story: (typeof stories)[0] }) {
  return (
    <div className="flex-shrink-0 w-[350px] mx-4 p-4 rounded-lg bg-card border flex items-center gap-4">
        <Avatar className="h-12 w-12 border">
            <AvatarImage src={story.avatar} alt={story.user} />
            <AvatarFallback>{story.user[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <p className="text-sm text-muted-foreground">"{story.text}"</p>
            <p className="text-xs font-semibold mt-2 text-right">- {story.user} & {story.pet}</p>
        </div>
    </div>
  )
}

export function StoryMarquee() {
  return (
    <section className="py-8 bg-secondary/30 overflow-hidden">
        <div className="relative flex">
            <motion.div className="flex" variants={marqueeVariants} animate="animate">
                {stories.map(story => <StoryItem key={story.id} story={story} />)}
                {stories.map(story => <StoryItem key={`${story.id}-2`} story={story} />)}
            </motion.div>
             <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary/30 to-transparent" />
             <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary/30 to-transparent" />
        </div>
    </section>
  )
}
