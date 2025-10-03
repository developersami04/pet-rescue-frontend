
'use client';

import { ScrollArea } from './ui/scroll-area';
import { NotificationItem } from './notification-item';
import type { Notification } from '@/lib/data';
import { Bell } from 'lucide-react';

type NotificationListProps = {
  notifications: Notification[];
  onMarkAsRead: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function NotificationList({ notifications, onMarkAsRead, onDelete }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Bell className="h-10 w-10 mb-4" />
        <p className="font-medium">No new notifications</p>
        <p className="text-sm">You're all caught up!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-auto max-h-[60vh] md:max-h-96">
      <div className="flex flex-col">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            isLast={index === notifications.length - 1}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
