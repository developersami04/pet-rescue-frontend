

'use client';

import { Card } from "@/components/ui/card";
import { RegisteredUser } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Award, BadgeCheck, Loader2, Mail, MoreVertical, User, UserCheck, UserCog, UserX, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserListItemProps = {
    user: RegisteredUser;
    onUpdate: (userId: number, field: 'is_verified' | 'is_active' | 'is_staff', value: boolean) => void;
    isUpdating: boolean;
}

export function UserListItem({ user, onUpdate, isUpdating }: UserListItemProps) {
    const fullName = `${user.first_name} ${user.last_name}`;
    const avatarFallback = (user.first_name?.[0] ?? '') + (user.last_name?.[0] ?? '');
    const joinedDate = new Date(user.date_joined);

    return (
        <Card className="p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <Avatar className="h-12 w-12">
                <AvatarImage src={user.profile_image ?? ''} alt={fullName} />
                <AvatarFallback>{avatarFallback || user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <div className="col-span-1">
                    <p className="font-bold">{fullName}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
                 <div className="col-span-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}
                    </p>
                </div>
                <div className="col-span-1 flex flex-wrap gap-2">
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
                 <div className="flex justify-end items-center gap-2">
                     <Button size="sm" onClick={() => onUpdate(user.id, 'is_verified', !user.is_verified)} disabled={isUpdating}>
                         {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         {user.is_verified ? 'Unverify' : 'Verify'}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onUpdate(user.id, 'is_active', !user.is_active)}>
                                {user.is_active ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                <span>{user.is_active ? 'Deactivate' : 'Activate'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdate(user.id, 'is_staff', !user.is_staff)}>
                                 {user.is_staff ? <User className="mr-2 h-4 w-4" /> : <UserCog className="mr-2 h-4 w-4" />}
                                <span>{user.is_staff ? 'Make User' : 'Make Staff'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    )
}
