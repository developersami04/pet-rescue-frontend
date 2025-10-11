
'use client';

import Image from 'next/image';
import { featuredPetsPng } from '@/lib/page-data/home';
import { useEffect, useState } from 'react';

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
    </section>
  );
}
