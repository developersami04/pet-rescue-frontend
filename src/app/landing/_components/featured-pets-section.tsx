
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredPets = [
  { 
    id: 'pet-buddy', 
    name: 'Buddy', 
    breed: 'Golden Retriever', 
    imageHint: 'golden retriever',
    imageUrl: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=689'
  },
  { 
    id: 'pet-luna', 
    name: 'Luna', 
    breed: 'Siamese Cat', 
    imageHint: 'siamese cat',
    imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=870&auto=format&fit=crop'
  },
  { 
    id: 'pet-daisy', 
    name: 'Daisy', 
    breed: 'Terrier Mix', 
    imageHint: 'terrier dog',
    imageUrl: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627'
  },
  { 
    id: 'pet-milo', 
    name: 'Milo', 
    breed: 'Ginger Tabby', 
    imageHint: 'ginger cat',
    imageUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=601'
  },
  {
    id: 'pet-rocky',
    name: 'Rocky',
    breed: 'Boxer',
    imageHint: 'boxer dog',
    imageUrl: 'https://images.unsplash.com/photo-1504826260979-242151ee45b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687ttps://images.unsplash.com/photo-1516371294522-b6c22889c200?q=80&w=870&auto=format&fit=crop'
  },
  {
    id: 'pet-smokey',
    name: 'Smokey',
    breed: 'Russian Blue',
    imageHint: 'grey cat',
    imageUrl: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=870&auto=format&fit=crop'
  }
];

export function FeaturedPetsSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-headline">Featured Pets</h2>
            <Button asChild variant="ghost">
                <Link href="/pets">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
        <Carousel 
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
          <CarouselContent>
            {featuredPets.map((pet) => (
              <CarouselItem key={pet.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                    <Link href="/pets" className="group h-full">
                        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="relative aspect-square w-full">
                            <Image
                            src={pet.imageUrl}
                            alt={pet.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={pet.imageHint}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle>{pet.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{pet.breed}</p>
                        </CardContent>
                        </Card>
                    </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 disabled:opacity-0" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 disabled:opacity-0" />
        </Carousel>
      </div>
    </section>
  );
}
