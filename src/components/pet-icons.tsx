
'use client';

import {
  Dog,
  Cat,
  Squirrel,
  PawPrint,
  Bird,
  Feather,
  Egg,
  Duck,
  Turtle,
  Fish,
  Snail,
  Bug,
  Spider,
  PiggyBank,
  Flame,
  Flower,
  Skull,
  Mountain,
  Waves,
  Sheep,
  Horse,
  Cow,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export const petIcons: { [key: string]: React.FC<LucideProps> } = {
  Dog: Dog,
  Cat: Cat,
  Rabbit: PawPrint, // Fallback
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
  Duck: Duck,
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
  Axolotl: Waves, // Fallback
  Fish: Fish,
  Koi: Fish,
  Betta: Fish,
  HermitCrab: Snail, // Fallback
  Snail: Snail,
  Insect: Bug,
  Spider: Spider,
  Scorpion: Skull,
  SugarGlider: Squirrel,
  Goat: Mountain,
  Sheep: Sheep,
  MiniPig: PiggyBank,
  Horse: Horse,
  Donkey: Horse,
  Cow: Cow,
  Alpaca: Sheep,
  Llama: Sheep,
  Parakeet: Bird,
  Cockatiel: Bird,
  Macaw: Bird,
};

export function PetTypeIcon({ typeName, ...props }: { typeName: string } & LucideProps) {
    const cleanTypeName = typeName.replace(/\s/g, '');
    const Icon = petIcons[cleanTypeName] || PawPrint;
    return <Icon {...props} />;
}
