
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getPetTypes } from "@/lib/actions/pet.actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PetTypeIcon } from "@/components/pet-icons";

type PetType = {
  id: number;
  name: string;
};

export const dynamic = 'force-dynamic';

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


function CategoryCard({ petType }: { petType: PetType }) {
  const colors = [
    "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
    "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300",
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300",
  ];
  const colorIndex = getHash(petType.name) % colors.length;
  const colorClasses = colors[colorIndex];

  return (
    <Link href={`/pets?type=${petType.name}`} className="group">
        <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col", colorClasses)}>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center flex-grow">
                <PetTypeIcon typeName={petType.name} className="h-12 w-12 mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl font-bold">{petType.name}</h3>
                <p className="text-sm mt-1">View All</p>
            </CardContent>
        </Card>
    </Link>
  );
}


export default async function PetCategoriesPage() {
  const petTypes: PetType[] | null = await getPetTypes();

  if (!petTypes || petTypes.length === 0) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
             <PageHeader
                title="Pet Categories"
                description="Browse pets by their category."
            />
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Could not fetch pet categories. Please try again later.</AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       <PageHeader
            title="Pet Categories"
            description="Browse pets by their category."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {petTypes.map((petType) => (
                <CategoryCard key={petType.id} petType={petType} />
            ))}
        </div>
    </div>
  );
}
