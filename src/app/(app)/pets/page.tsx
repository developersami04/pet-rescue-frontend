"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pets, Pet } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

const petTypes = ["All", ...Array.from(new Set(pets.map((p) => p.type)))];
const petSizes = ["All", ...Array.from(new Set(pets.map((p) => p.size)))];

export default function PetsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [size, setSize] = useState("All");

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower);
      const matchesType = type === "All" || pet.type === type;
      const matchesSize = size === "All" || pet.size === size;
      return matchesSearch && matchesType && matchesSize;
    });
  }, [search, type, size]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Find a New Friend"
        description="Browse our available pets and find your perfect match."
      />
      <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {petTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by size" />
            </SelectTrigger>
            <SelectContent>
              {petSizes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Button onClick={() => { setSearch(''); setType('All'); setSize('All'); }} variant="secondary">Clear Filters</Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPets.map((pet) => {
          const petImage = PlaceHolderImages.find(
            (p) => p.id === pet.imageIds[0]
          );
          return (
            <Card key={pet.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <div className="relative h-56 w-full">
                {petImage && (
                  <Image
                    src={petImage.imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    data-ai-hint={petImage.imageHint}
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="font-headline tracking-wide">{pet.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {pet.breed} &bull; {pet.age} {pet.age > 1 ? 'years' : 'year'} old
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/pets/${pet.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {filteredPets.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">No Pets Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters to find more friends.</p>
        </div>
      )}
    </div>
  );
}
