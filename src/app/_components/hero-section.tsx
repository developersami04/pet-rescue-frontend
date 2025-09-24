
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { pets } from '@/lib/data';
import Autoplay from "embla-carousel-autoplay";

export function HeroSection() {
  const featuredPets = pets.slice(0, 5);

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full">
      <Carousel
        className="w-full h-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {featuredPets.map((pet) => {
            const petImage = PlaceHolderImages.find(
              (p) => p.id === pet.imageIds[0]
            );
            return (
              <CarouselItem key={pet.id}>
                <div className="relative h-full w-full">
                  {petImage && (
                    <Image
                      src={petImage.imageUrl}
                      alt={pet.name}
                      fill
                      className="object-cover"
                      data-ai-hint={petImage.imageHint}
                      priority={featuredPets.indexOf(pet) === 0}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>

      <div className="absolute inset-0 z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4">
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
            <Link href="/matching">AI Pet Matcher</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
