

import { UserProfileCard } from "./_components/user-profile-card";
import { FavoritePets } from "./_components/favorite-pets";
import { MyPets } from "./_components/my-pets";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 md:sticky md:top-24 self-start">
          <UserProfileCard />
        </div>
        <div className="md:col-span-2 space-y-8">
          <FavoritePets />
          <MyPets />
        </div>
      </div>
    </div>
  )
}
