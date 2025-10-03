
'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationList } from '@/components/notification-list';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Notification } from '@/lib/data';
import { getNotifications } from '@/lib/actions';
import { useAuth } from '@/lib/auth.tsx';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { unreadCount, markAsRead, deleteNotification } = useNotifications();
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  const fetchAllNotifications = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await getNotifications(token, {
        pet_status: statusFilter,
        read_status: readFilter,
      });
      setAllNotifications(data);
    } catch (error) {
      console.error('Failed to fetch all notifications', error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, readFilter]);

  useEffect(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  const handleRefresh = () => {
    fetchAllNotifications();
  };

  const handleMarkAsReadInList = async (id: number) => {
    await markAsRead(id);
    setAllNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
  };
  
  const handleDeleteInList = async (id: number) => {
      await deleteNotification(id);
      setAllNotifications(prev => prev.filter(n => n.id !== id));
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Notifications"
          description={`You have ${unreadCount} unread notifications.`}
          className="pb-0"
        />
        <Button onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="found">Found</SelectItem>
            <SelectItem value="adopt">Adoptable</SelectItem>
          </SelectContent>
        </Select>

        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by read status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading notifications...</p>
          </div>
        ) : (
          <NotificationList 
            notifications={allNotifications}
            onMarkAsRead={handleMarkAsReadInList}
            onDelete={handleDeleteInList}
          />
        )}
      </div>
    </div>
  );
}
