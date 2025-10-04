
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-background');

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

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline shadow-2xl">
          Find Your Forever Friend
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl shadow-2xl">
          Connecting loving homes with adorable pets in need. Start your
          journey to find the perfect companion today.
        </p>
        <div className="mt-8 flex gap-4">
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
        </div>
      </div>
    </section>
  );
}
