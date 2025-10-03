
'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { getNotifications, readNotification as apiReadNotification, deleteNotification as apiDeleteNotification } from '@/lib/action_api';
import { useAuth } from '@/lib/auth.tsx';
import type { Notification } from '@/lib/data';

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => void;
  markAsRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    setIsLoading(true);
    try {
      const allNotifications = await getNotifications(token);
      setNotifications(allNotifications);
      const unread = allNotifications.filter((n: Notification) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await apiReadNotification(token, id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read`, error);
    }
  };

  const deleteNotification = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const notification = notifications.find(n => n.id === id);

    try {
      await apiDeleteNotification(token, id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {
      console.error(`Failed to delete notification ${id}`, error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, isLoading, fetchNotifications, markAsRead, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
