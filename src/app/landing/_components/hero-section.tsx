
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import placeholderImages from '@/lib/placeholder-images.json';
import { motion } from 'framer-motion';
import { featuredPetsPng } from '@/lib/page-data/home';
import { useEffect, useState } from 'react';

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
  const [randomPet, setRandomPet] = useState<{ id: string, src: string, alt: string, hint: string } | null>(null);

  useEffect(() => {
    const selectedPet = featuredPetsPng[Math.floor(Math.random() * featuredPetsPng.length)];
    setRandomPet(selectedPet);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
      
    </section>
  );
}
