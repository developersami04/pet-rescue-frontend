
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RegisteredUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Award, BadgeCheck, Mail, UserCheck, UserCog, UserX, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

type UserCardProps = {
  user: RegisteredUser;
};

export function UserCard({ user }: UserCardProps) {
  const fullName = `${user.first_name} ${user.last_name}`;
  const avatarFallback = (user.first_name?.[0] ?? '') + (user.last_name?.[0] ?? '');
  const joinedDate = new Date(user.date_joined);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="p-4 items-center gap-4 flex-row">
            <Avatar className="h-16 w-16">
                <AvatarImage src={user.profile_image ?? ''} alt={fullName} />
                <AvatarFallback>{avatarFallback || user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                 <h3 className="text-lg font-bold">{fullName}</h3>
                 <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
        </CardHeader>
      <CardContent className="flex-grow space-y-3 p-4 pt-0">
         <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" /> {user.email}
        </p>
        <div className="flex flex-wrap gap-2">
            <Badge variant={user.is_verified ? 'default' : 'secondary'} className="gap-1">
                {user.is_verified ? <BadgeCheck className="h-3 w-3"/> : <XCircle className="h-3 w-3" />}
                {user.is_verified ? 'Verified' : 'Not Verified'}
            </Badge>
            <Badge variant={user.is_active ? 'default' : 'destructive'} className="gap-1">
                 {user.is_active ? <BadgeCheck className="h-3 w-3"/> : <XCircle className="h-3 w-3" />}
                {user.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant={user.is_staff ? 'default' : 'secondary'} className="gap-1">
                {user.is_staff ? <Award className="h-3 w-3"/> : <User className="h-3 w-3" />}
                {user.is_staff ? 'Staff' : 'User'}
            </Badge>
        </div>
        <p className="text-xs text-muted-foreground pt-2">Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 !p-4 border-t">
        <Button className="w-full">
            {user.is_verified ? <XCircle className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
            {user.is_verified ? 'Unverify' : 'Verify'}
        </Button>
        <Button variant="secondary" className="w-full">
            {user.is_active ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
            {user.is_active ? 'Deactivate' : 'Activate'}
        </Button>
        <Button variant="outline" className="w-full">
            {user.is_staff ? <User className="mr-2 h-4 w-4" /> : <UserCog className="mr-2 h-4 w-4" />}
             {user.is_staff ? 'Make User' : 'Make Staff'}
        </Button>
      </CardFooter>
    </Card>
  );
}
