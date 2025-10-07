

'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RegisteredUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Award, BadgeCheck, Loader2, Mail, User, UserCheck, UserCog, UserX, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

type UserCardProps = {
  user: RegisteredUser;
  onUpdate: (userId: number, field: 'is_verified' | 'is_active' | 'is_staff', value: boolean) => void;
  isUpdating: boolean;
};

export function UserCard({ user, onUpdate, isUpdating }: UserCardProps) {
  const fullName = `${user.first_name} ${user.last_name}`;
  const avatarFallback = (user.first_name?.[0] ?? '') + (user.last_name?.[0] ?? '');
  const joinedDate = new Date(user.date_joined);

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl", user.is_staff && "bg-primary/5 border-primary/50")}>
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
        <Button className="w-full" onClick={() => onUpdate(user.id, 'is_verified', !user.is_verified)} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user.is_verified ? <XCircle className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
            {user.is_verified ? 'Unverify' : 'Verify'}
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => onUpdate(user.id, 'is_active', !user.is_active)} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user.is_active ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
            {user.is_active ? 'Deactivate' : 'Activate'}
        </Button>
        <Button variant="outline" className="w-full" onClick={() => onUpdate(user.id, 'is_staff', !user.is_staff)} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user.is_staff ? <User className="mr-2 h-4 w-4" /> : <UserCog className="mr-2 h-4 w-4" />}
             {user.is_staff ? 'Make User' : 'Make Staff'}
        </Button>
      </CardFooter>
    </Card>
  );
}
