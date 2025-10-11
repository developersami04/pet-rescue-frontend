
'use client';

import Image from 'next/image';
import { heroImages } from '@/lib/page-data/home';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [randomPet, setRandomPet] = useState<{ id: string, src: string, alt: string, hint: string } | null>(null);

  useEffect(() => {
    const selectedPet = heroImages[Math.floor(Math.random() * heroImages.length)];
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
      <div className="relative z-10 text-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg">Find Your Forever Friend</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
          Connecting loving homes with pets in need. Start your adoption journey today.
        </p>
      </div>
    </section>
  );
}
