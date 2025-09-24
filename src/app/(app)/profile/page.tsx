
import { UserProfileCard } from "./_components/user-profile-card";
import { FavoritePets } from "./_components/favorite-pets";

export default function ProfilePage() {
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserProfileCard />
        </div>
        <div className="md:col-span-2">
          <FavoritePets />
        </div>
      </div>
    </div>
  )
}
