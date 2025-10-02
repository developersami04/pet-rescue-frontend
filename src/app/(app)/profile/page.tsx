

import { UserProfileCard } from "./_components/user-profile-card";
import { FavoritePets } from "./_components/favorite-pets";
import { MyPets } from "./_components/my-pets";

export default function ProfilePage() {
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <UserProfileCard />
            <MyPets />
        </div>
        <div className="lg:col-span-1">
            <FavoritePets />
        </div>
      </div>
    </div>
  )
}
