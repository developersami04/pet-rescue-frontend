
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
    imageUrl: 'https://images.unsplash.com/photo-1611250282006-4484dd3f214b?q=80&w=870&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1588722838248-a72a153229c8?q=80&w=870&auto=format&fit=crop'
  },
  { 
    id: 'pet-milo', 
    name: 'Milo', 
    breed: 'Ginger Tabby', 
    imageHint: 'ginger cat',
    imageUrl: 'https://images.unsplash.com/photo-1596724033623-64b5f4d36b94?q=80&w=870&auto=format&fit=crop'
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
