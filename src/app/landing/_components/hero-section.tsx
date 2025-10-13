
'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { heroImages } from '@/lib/page-data/home';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
    },
  },
};

const features = [
  {
    title: 'Find',
    imageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkb2d8ZW58MHx8fHwxNzU5MDM2ODMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'dog happy',
  },
  {
    title: 'Rescue',
    imageUrl:
      'https://images.unsplash.com/photo-1596492784533-2c70a2b5d81e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjYXR8ZW58MHx8fHwxNzU5MDUxOTQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'cat curious',
  },
  {
    title: 'Adopt',
    imageUrl:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwZXRzfGVufDB8fHx8fDE3NTg5NzM4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'puppy cute',
  },
];

const backgroundImage = heroImages[0];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-24 h-screen min-h-[600px] flex items-center justify-center">
      <Image
        src={backgroundImage.src}
        alt={backgroundImage.alt}
        fill
        className="object-cover blur-sm brightness-75"
        data-ai-hint={backgroundImage.hint}
        priority
      />
      <div className="absolute inset-0 bg-background/50" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <motion.div
            className="space-y-6 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white font-headline md:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="relative inline-block">
                Petopia
                <span className="absolute bottom-0 left-0 h-1 w-full bg-primary/80" />
              </span>
            </h1>
            <p className="max-w-xl text-lg text-white/90 mx-auto md:mx-0">
              Your one-stop destination for finding a new furry friend. Browse
              pets, report lost animals, and connect with a community of pet
              lovers.
            </p>
            <Button size="lg" asChild>
              <Link href="/pets">Explore Pets</Link>
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="relative space-y-2 text-center"
                variants={itemVariants}
              >
                <div
                  className={
                    'relative mx-auto aspect-square w-full max-w-48 overflow-hidden rounded-full border-4 border-secondary/50 shadow-lg'
                  }
                >
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    data-ai-hint={feature.imageHint}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white font-headline">
                  {feature.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
