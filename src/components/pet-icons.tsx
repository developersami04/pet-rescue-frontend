
'use client';

import {
  Dog,
  Cat,
  Rabbit,
  Bird,
  Fish,
  Turtle,
  Snail,
  Bug,
  Feather,
  PawPrint,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export const petIcons: { [key: string]: React.FC<LucideProps> } = {
  Dog: Dog,
  Cat: Cat,
  Rabbit: Rabbit,
  Bird: Bird,
  Fish: Fish,
  Turtle: Turtle,
  Snail: Snail,
  Insect: Bug,
  Feather: Feather,
  Default: PawPrint,
};

export function PetTypeIcon({ typeName, ...props }: { typeName: string } & LucideProps) {
    const Icon = petIcons[typeName] || petIcons.Default;
    return <Icon {...props} />;
}
