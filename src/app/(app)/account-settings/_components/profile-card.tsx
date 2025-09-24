import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pen } from "lucide-react";
import { sampleUser } from "@/lib/user-data";

export function ProfileCard() {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={sampleUser.profile_image ?? `https://picsum.photos/seed/${sampleUser.username}/200/200`} alt={sampleUser.username} />
                        <AvatarFallback>{sampleUser.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                        <Pen className="h-4 w-4" />
                        <span className="sr-only">Edit Profile Picture</span>
                    </Button>
                </div>
                <h2 className="text-xl font-bold">{sampleUser.first_name} {sampleUser.last_name}</h2>
                <p className="text-muted-foreground">{sampleUser.email}</p>
            </CardContent>
        </Card>
    );
}
