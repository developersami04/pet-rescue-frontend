import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { sampleUser } from "@/lib/user-data";

export function UserProfileCard() {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={sampleUser.profile_image ?? `https://picsum.photos/seed/${sampleUser.username}/200/200`} alt={sampleUser.username} />
                    <AvatarFallback>{sampleUser.first_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{sampleUser.first_name} {sampleUser.last_name}</h2>
                <p className="text-muted-foreground">@{sampleUser.username}</p>
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
    );
}
