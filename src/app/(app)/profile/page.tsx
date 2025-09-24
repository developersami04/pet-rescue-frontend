
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pets } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Heart, PawPrint } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function ProfilePage() {
  const favoritePets = pets.slice(0, 3);
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="https://picsum.photos/seed/user/200/200" alt="Guest User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">Guest User</h2>
                    <p className="text-muted-foreground">Joined in 2024</p>
                    <div className="flex gap-4 mt-4 text-muted-foreground">
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-foreground">3</h3>
                            <p className="text-xs">Favorites</p>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-foreground">1</h3>
                            <p className="text-xs">Adoptions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Favorite Pets</CardTitle>
                    <CardDescription>Pets you've saved to your favorites.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritePets.map(pet => {
                      const petImage = PlaceHolderImages.find(p => p.id === pet.imageIds[0]);
                      return (
                        <Card key={pet.id} className="overflow-hidden">
                          <div className="relative h-40 w-full">
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
                          <CardHeader className="p-4">
                            <CardTitle className="text-base font-bold">{pet.name}</CardTitle>
                          </CardHeader>
                           <CardFooter className="p-4 pt-0">
                             <Button asChild className="w-full" variant="secondary" size="sm">
                                <Link href={`/pets/${pet.id}`}>View</Link>
                              </Button>
                           </CardFooter>
                        </Card>
                      )
                    })}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
