
'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { getNotifications, readNotification as apiReadNotification, deleteNotification as apiDeleteNotification } from '@/lib/actions';
import { useAuth } from '@/lib/auth.tsx';
import type { Notification } from '@/lib/data';

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnreadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    // We don't set loading to true for background fetches
    try {
      const unreadNotifications = await getNotifications(token, { read_status: 'unread' });
      setNotifications(unreadNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error: any) {
        if (error.message.includes('Session expired')) {
            logout();
        } else {
          console.error("Failed to fetch unread notifications", error);
        }
    }
  }, [isAuthenticated, logout]);

  // Initial fetch
  useEffect(() => {
    if(isAuthenticated) {
      setIsLoading(true);
      fetchUnreadNotifications().finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, fetchUnreadNotifications]);

  // Set up polling
  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(fetchUnreadNotifications, 60*60*1000); // 5 minutes
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [isAuthenticated, fetchUnreadNotifications]);


  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.is_read) return;

    try {
      await apiReadNotification(token, id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read`, error);
      throw error;
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
      throw error;
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, isLoading, markAsRead, deleteNotification }}>
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
