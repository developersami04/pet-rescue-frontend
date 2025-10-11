
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { featuredPetsPng } from '@/lib/page-data/home';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
  const [randomPet, setRandomPet] = useState<{ id: string, src: string, alt: string, hint: string } | null>(null);

  useEffect(() => {
    const selectedPet = featuredPetsPng[Math.floor(Math.random() * featuredPetsPng.length)];
    setRandomPet(selectedPet);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
      {randomPet && (
        <Image
          src={randomPet.src}
          alt={randomPet.alt}
          fill
          className="object-cover"
          data-ai-hint={randomPet.hint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <motion.div 
        className="relative z-10 text-center text-white px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg"
          variants={itemVariants}
        >
          Find Your Forever Friend
        </motion.h1>
        <motion.p 
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90 drop-shadow-md"
          variants={itemVariants}
        >
          Connecting loving homes with pets in need. Your journey to finding a new companion starts here.
        </motion.p>
        <motion.div 
          className="mt-8 flex justify-center gap-4"
          variants={itemVariants}
        >
          <Button size="lg" asChild>
            <Link href="/pets">
              Browse Pets <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/about-us">
              Learn More
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
