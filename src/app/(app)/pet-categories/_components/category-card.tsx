
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PawPrint } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PetType = {
  id: number;
  name: string;
};

type CategoryCardProps = {
  petType: PetType;
};

// A simple hash function to get a color index from the pet type name
function getHash(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}


export function CategoryCard({ petType }: CategoryCardProps) {
  const colors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
  ];
  const colorIndex = getHash(petType.name) % colors.length;
  const colorClasses = colors[colorIndex];


  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-full", colorClasses)}>
                <PawPrint className="h-6 w-6"/>
            </div>
            <CardTitle>{petType.name}</CardTitle>
        </div>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/pets?type=${petType.name}`}>
            View {petType.name}s
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

    