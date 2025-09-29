
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pen } from "lucide-react";
import { useUserDetails } from "@/hooks/use-user-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChangeProfilePictureDialog } from "./change-profile-picture-dialog";


export function ProfileCard() {
    const { user, isLoading, error, refreshUserDetails } = useUserDetails();

    if (isLoading) {
        return (
             <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!user) {
        return null;
    }

    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <ChangeProfilePictureDialog user={user} onUpdate={refreshUserDetails}>
                        <div className="group relative">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src={user.profile_image ?? `https://picsum.photos/seed/${user.username}/200/200`} alt={user.username} />
                                <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Pen className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </ChangeProfilePictureDialog>
                </div>
                <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
            </CardContent>
        </Card>
    );
}
