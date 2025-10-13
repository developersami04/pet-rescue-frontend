
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Dummy data for featured pets with Unsplash images
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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
      damping: 12,
    },
  },
};

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
        <div className="md:hidden">
          <motion.div
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featuredPets.map((pet) => (
              <motion.div key={pet.id} variants={cardVariants} className="flex-shrink-0 w-3/4 sm:w-2/5">
                <Link href="/pets" className="group h-full">
                    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-square w-full">
                        <Image
                        src={pet.imageUrl}
                        alt={pet.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={pet.imageHint}
                        sizes="(max-width: 768px) 75vw, 25vw"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div
          className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredPets.map((pet) => {
            return (
              <motion.div key={pet.id} variants={cardVariants}>
                <Link href="/pets" className="group">
                    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-square w-full">
                        <Image
                        src={pet.imageUrl}
                        alt={pet.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={pet.imageHint}
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
