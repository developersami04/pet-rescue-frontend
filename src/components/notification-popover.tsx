
'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import { Bell, BellRing } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationList } from './notification-list';
import { Card, CardHeader, CardTitle, CardFooter } from './ui/card';
import Link from 'next/link';

export function NotificationPopover() {
  const { notifications, unreadCount } = useNotifications();
  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
             <BellRing className="h-5 w-5 animate-in fade-in-0 slide-in-from-top-2" />
          ) : (
             <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 md:w-96">
        <Card className="shadow-none border-none">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            {unreadCount > 0 && (
                 <span className="text-sm text-muted-foreground">{unreadCount} unread</span>
            )}
          </CardHeader>
          <NotificationList notifications={unreadNotifications.slice(0, 5)} />
          <CardFooter className="p-2 border-t">
             <Button variant="link" className="w-full" asChild>
                 <Link href="/notifications">View all notifications</Link>
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
