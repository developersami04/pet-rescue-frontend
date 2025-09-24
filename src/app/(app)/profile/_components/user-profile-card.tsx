import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { sampleUser } from "@/lib/user-data";
import { PawPrint, Heart, Home, Award } from "lucide-react";

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
                
                <div className="mt-6 w-full grid grid-cols-2 gap-4 text-muted-foreground">
                    <div className="text-center flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                        <Heart className="w-5 h-5 text-destructive"/>
                        <h3 className="font-bold text-lg text-foreground">3</h3>
                        <p className="text-xs">Favorites</p>
                    </div>
                    <div className="text-center flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                        <Home className="w-5 h-5 text-primary"/>
                        <h3 className="font-bold text-lg text-foreground">1</h3>
                        <p className="text-xs">Adoptions</p>
                    </div>
                    <div className="text-center flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                        <PawPrint className="w-5 h-5 text-accent-foreground"/>
                        <h3 className="font-bold text-lg text-foreground">5</h3>
                        <p className="text-xs">Pets Added</p>
                    </div>
                    <div className="text-center flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50">
                         <Award className="w-5 h-5 text-yellow-500"/>
                        <h3 className="font-bold text-lg text-foreground">2</h3>
                        <p className="text-xs">Rescued</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
