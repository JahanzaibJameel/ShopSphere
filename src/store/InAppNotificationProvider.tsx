import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const storage = new MMKV({ id: 'notification-storage' });
const STORAGE_KEY = 'notifications';

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order Shipped',
    body: 'Your order #12345 has been shipped and is on its way!',
    type: 'delivery',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    data: { orderId: '12345' },
  },
  {
    id: '2',
    title: 'Flash Sale! 50% Off',
    body: 'Limited time offer on electronics. Shop now!',
    type: 'promotion',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
    data: { promotionId: 'promo-1' },
  },
  {
    id: '3',
    title: 'Order Confirmed',
    body: 'Your order #12344 has been confirmed and is being processed.',
    type: 'order',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    data: { orderId: '12344' },
  },
  {
    id: '4',
    title: 'Welcome to ShopSphere!',
    body: 'Thanks for joining. Enjoy 10% off your first order.',
    type: 'system',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
  },
];

export function InAppNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const saved = storage.getString(STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications(mockNotifications);
    }
  }, []);

  useEffect(() => {
    try {
      storage.set(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useInAppNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
