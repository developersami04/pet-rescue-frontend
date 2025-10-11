
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import placeholderImages from '@/lib/placeholder-images.json';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};


export function HeroSection() {
  const heroImage = placeholderImages.placeholderImages.find((p) => p.id === 'hero-background');

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

      <motion.div 
        className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline [text-shadow:0_0_8px_hsl(var(--primary)/0.8)]"
          variants={itemVariants}
        >
          Find Your Forever Friend
        </motion.h1>
        <motion.p 
          className="mt-4 max-w-2xl text-lg md:text-xl [text-shadow:0_0_8px_hsl(var(--primary)/0.7)]"
          variants={itemVariants}
        >
          Connecting loving homes with adorable pets in need. Start your
          journey to find the perfect companion today.
        </motion.p>
        <motion.div 
          className="mt-8 flex gap-4"
          variants={itemVariants}
        >
          <Button
            size="lg"
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/pets">Browse Pets</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/about-us">Learn More</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
