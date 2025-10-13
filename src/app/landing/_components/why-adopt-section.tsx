
'use client';

import { PawPrint, HeartHandshake, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
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
      stiffness: 100,
      damping: 10,
    },
  },
};

const features = [
    {
        icon: PawPrint,
        title: "Save a Life",
        description: "You're giving a deserving animal a second chance at a happy life.",
    },
    {
        icon: HeartHandshake,
        title: "Fight Puppy Mills",
        description: "Choosing adoption helps stop the cycle of pet overpopulation and cruelty.",
    },
    {
        icon: Home,
        title: "Find a Great Pet",
        description: "Adoption fees are much lower than buying from a breeder and often include vaccinations.",
    }
]

export function WhyAdoptSection() {
  return (
    <section className="py-12 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 font-headline"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          Why Adopt From Petrescue?
        </motion.h2>
        <motion.div 
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={i} 
                className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow"
                variants={itemVariants}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  );
}
