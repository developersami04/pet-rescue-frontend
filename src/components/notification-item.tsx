
'use client';

import type { Notification } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Check, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLast?: boolean;
};

export function NotificationItem({ notification, onMarkAsRead, onDelete, isLast = false }: NotificationItemProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleNavigate = async () => {
        if (!notification.is_read) {
            await onMarkAsRead(notification.id);
        }
        router.push(`/pets/${notification.pet_id}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await onDelete(notification.id);
            toast({ title: "Notification deleted" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Failed to delete", description: error.message });
        }
    }
    
    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await onMarkAsRead(notification.id);
            toast({ title: "Marked as read" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Failed to mark as read", description: error.message });
        }
    }

  return (
    <div
      onClick={handleNavigate}
      className={cn(
        'group relative flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50',
        !isLast && 'border-b',
        !notification.is_read && 'bg-primary/5'
      )}
    >
      {!notification.is_read && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
      )}
      <Avatar className="h-10 w-10">
        <AvatarImage src={notification.pet_image ?? `https://picsum.photos/seed/${notification.pet_id}/100`} />
        <AvatarFallback>{notification.pet_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm leading-snug">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.is_read && (
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleMarkAsRead} aria-label="Mark as read">
                <Check className="h-4 w-4" />
            </Button>
        )}
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={handleDelete} aria-label="Delete notification">
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
