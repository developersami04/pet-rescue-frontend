import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function UserProfileCard() {
    return (
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
    );
}
