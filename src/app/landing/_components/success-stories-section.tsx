
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const storySteps = [
  {
    step: '01',
    title: 'Find a Friend',
    description: 'Browse through profiles of adorable pets waiting for a loving home. Use filters to find your perfect match.',
    color: 'bg-orange-200/50',
    pinColor: 'bg-red-400',
  },
  {
    step: '02',
    title: 'Learn Their Story',
    description: "Dive into each pet's profile to learn about their personality, history, and medical background.",
    color: 'bg-blue-200/50',
    pinColor: 'bg-blue-400',
  },
  {
    step: '03',
    title: 'Make a Connection',
    description: 'Submit an adoption request to express your interest and tell the owner why you\'d be a great fit.',
    color: 'bg-purple-200/50',
    pinColor: 'bg-purple-400',
  },
  {
    step: '04',
    title: 'Get Approved',
    description: 'The pet owner and our admin team will review your request. This ensures every pet goes to a safe home.',
    color: 'bg-orange-200/50',
    pinColor: 'bg-red-400',
  },
  {
    step: '05',
    title: 'Welcome Home',
    description: 'Once approved, arrange a meet-and-greet and welcome your new best friend into your family.',
    color: 'bg-blue-200/50',
    pinColor: 'bg-blue-400',
  },
  {
    step: '06',
    title: 'Share Your Story',
    description: 'Inspire others by sharing your adoption journey. Your story can encourage more people to adopt.',
    color: 'bg-purple-200/50',
    pinColor: 'bg-purple-400',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

export function SuccessStoriesSection() {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, hsl(var(--border)), hsl(var(--border)) 1px, transparent 1px, transparent 2.5rem)',
        }}
      />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold font-headline text-center">Your Adoption Journey</h2>
            <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">
                Follow these simple steps to find your forever friend and create a success story of your own.
            </p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {storySteps.map((item, index) => (
            <motion.div key={item.step} className="relative" variants={cardVariants}>
              <div className="relative p-6 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full", item.pinColor)} />
                <div className="flex flex-col items-start gap-3">
                  <span className="text-2xl font-bold text-primary/50">{item.step}</span>
                  <h3 className="text-xl font-bold font-headline">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Button size="lg" asChild>
                <Link href="/stories">Read Success Stories</Link>
            </Button>
        </motion.div>

      </div>
    </section>
  );
}
