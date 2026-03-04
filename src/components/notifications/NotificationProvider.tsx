import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Notification, PushNotificationData } from '@/types';

interface NotificationContextType {
  requestPermissions: () => Promise<boolean>;
  scheduleNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => Promise<string>;
  cancelNotification: (notificationId: string) => Promise<void>;
  getBadgeCount: () => Promise<number>;
  setBadgeCount: (count: number) => Promise<void>;
  clearBadgeCount: () => Promise<void>;
  sendPushNotification: (data: PushNotificationData) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function NotificationProvider({ children }: NotificationProviderProps) {
  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
      } else {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted' || status === 'undetermined';
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const scheduleNotification = async (
    notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
  ): Promise<string> => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
        },
        trigger: null, // Show immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw new Error('Failed to schedule notification');
    }
  };

  const cancelNotification = async (notificationId: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw new Error('Failed to cancel notification');
    }
  };

  const getBadgeCount = async (): Promise<number> => {
    try {
      const badgeCount = await Notifications.getBadgeCountAsync();
      return badgeCount;
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  };

  const setBadgeCount = async (count: number): Promise<void> => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
      throw new Error('Failed to set badge count');
    }
  };

  const clearBadgeCount = async (): Promise<void> => {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge count:', error);
      throw new Error('Failed to clear badge count');
    }
  };

  const sendPushNotification = async (data: PushNotificationData): Promise<void> => {
    try {
      // This would typically be handled by your backend
      // For demo purposes, we'll create a local notification
      let title = '';
      let body = '';

      switch (data.type) {
        case 'order':
          title = 'Order Update';
          body = 'Your order status has been updated';
          break;
        case 'promotion':
          title = 'New Promotion';
          body = 'Check out our latest deals!';
          break;
        case 'delivery':
          title = 'Delivery Update';
          body = 'Your package is on its way';
          break;
        default:
          title = 'ShopSphere';
          body = 'You have a new notification';
      }

      await scheduleNotification({
        title,
        body,
        type: data.type as any,
        data,
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw new Error('Failed to send push notification');
    }
  };

  const value: NotificationContextType = {
    requestPermissions,
    scheduleNotification,
    cancelNotification,
    getBadgeCount,
    setBadgeCount,
    clearBadgeCount,
    sendPushNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper functions for common notification types
export const notificationHelpers = {
  orderConfirmation: async (orderId: string) => {
    // This would typically be called from your backend
    console.log(`Order confirmation notification for ${orderId}`);
  },

  orderShipped: async (orderId: string, trackingNumber: string) => {
    console.log(`Order shipped notification for ${orderId} with tracking ${trackingNumber}`);
  },

  orderDelivered: async (orderId: string) => {
    console.log(`Order delivered notification for ${orderId}`);
  },

  promotionAlert: async (promotionId: string, title: string, description: string) => {
    console.log(`Promotion alert for ${promotionId}: ${title} - ${description}`);
  },

  priceDrop: async (productId: string, oldPrice: number, newPrice: number) => {
    console.log(`Price drop for ${productId}: ${oldPrice} -> ${newPrice}`);
  },

  backInStock: async (productId: string, productName: string) => {
    console.log(`Back in stock notification for ${productName}`);
  },
};
