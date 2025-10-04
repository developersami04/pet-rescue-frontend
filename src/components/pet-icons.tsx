
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
  PiggyBank,
  Squirrel,
  Egg,
  Skull,
  Sun,
  Flower,
  Mountain,
  Flame,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export const petIcons: { [key: string]: React.FC<LucideProps> } = {
  Dog: Dog,
  Cat: Cat,
  Rabbit: Rabbit,
  GuineaPig: Squirrel,
  Hamster: PawPrint,
  Mouse: Squirrel,
  Rat: Skull,
  Gerbil: PawPrint,
  Ferret: Squirrel,
  Hedgehog: Flower,
  Chinchilla: PawPrint,
  Bird: Bird,
  Parrot: Feather,
  Canary: Feather,
  Finch: Feather,
  Dove: Bird,
  Chicken: Egg,
  Turkey: Feather,
  Goose: Bird,
  Turtle: Turtle,
  Tortoise: Turtle,
  Lizard: Flame,
  Gecko: Flame,
  BeardedDragon: Flame,
  Iguana: Flame,
  Snake: Skull,
  Frog: Mountain,
  Salamander: Flame,
  Axolotl: Sun, // Fallback
  Fish: Fish,
  Koi: Fish,
  Betta: Fish,
  HermitCrab: Snail,
  Snail: Snail,
  Insect: Bug,

  Scorpion: Skull,
  SugarGlider: Squirrel,
  Goat: Mountain,

  MiniPig: PiggyBank,

  Cow: PawPrint, // Fallback

  Parakeet: Bird,
  Cockatiel: Bird,
  Macaw: Bird,
};

export function PetTypeIcon({ typeName, ...props }: { typeName: string } & LucideProps) {
    const cleanTypeName = typeName.replace(/\s/g, '');
    const Icon = petIcons[cleanTypeName] || PawPrint;
    return <Icon {...props} />;
}
