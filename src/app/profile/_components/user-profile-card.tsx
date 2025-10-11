
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Award, BadgeCheck, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { useUserDetails } from "@/hooks/use-user-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";
import { DeactivateAccountDialog } from "@/app/account-settings/_components/deactivate-account-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ProfileSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="h-32 w-full" />
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="flex items-end -mt-12">
                     <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
                </div>
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                 <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}


export function UserProfileCard() {
    const { user, isLoading, error } = useUserDetails();

    if (isLoading) {
        return <ProfileSkeleton />;
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

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
    
    const firstInitial = user.first_name ? user.first_name.charAt(0) : '';
    const lastInitial = user.last_name ? user.last_name.charAt(0) : '';
    const usernameInitial = user.username ? user.username.charAt(0).toUpperCase() : '';
    const avatarFallback = `${firstInitial}${lastInitial}` || usernameInitial || 'U';

    const defaultImage = getRandomDefaultProfileImage(user.username);


    return (
        <Card className="overflow-hidden shadow-lg">
            <CardHeader className="p-0">
                <div className="h-32 bg-gradient-to-r from-primary/50 to-accent/50" />
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="flex items-end -mt-16">
                     <Avatar className="h-28 w-28 rounded-full border-4 border-background bg-background shadow-md">
                        <AvatarImage src={user.profile_image || defaultImage} alt={user.username} />
                        <AvatarFallback className="text-4xl">{avatarFallback}</AvatarFallback>
                    </Avatar>
                     <div className="ml-4 flex items-center gap-2">
                        {user.is_verified && (
                            <Badge variant="default" className="gap-1 pl-2 pr-3">
                                <BadgeCheck className="h-4 w-4" /> Verified
                            </Badge>
                        )}
                         {user.is_staff && (
                            <Badge variant="secondary" className="gap-1 pl-2 pr-3">
                                <Award className="h-4 w-4" /> Admin
                            </Badge>
                         )}
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="text-2xl font-bold font-headline">{fullName}</h2>
                    <p className="text-muted-foreground">@{user.username}</p>
                </div>
                
                <Separator className="my-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <UserIcon className="h-5 w-5" />
                        <span className="text-foreground">{user.gender}</span>
                    </div>
                     <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="h-5 w-5" />
                        <a href={`mailto:${user.email}`} className="text-foreground hover:underline">{user.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="h-5 w-5" />
                        <a href={`tel:${user.phone_no}`} className="text-foreground hover:underline">{user.phone_no}</a>
                    </div>
                     <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span className="text-foreground">{user.city}, {user.state}</span>
                    </div>
                </div>

                 <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm">
                    <p className="font-medium text-foreground">{user.address}</p>
                    <p className="text-muted-foreground">{user.city}, {user.state} - {user.pin_code}</p>
                </div>
            </CardContent>
            <CardFooter className="p-4 bg-muted/30 border-t flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/account-settings">Edit Profile</Link>
                </Button>
                <DeactivateAccountDialog />
            </CardFooter>
        </Card>
    );
}
