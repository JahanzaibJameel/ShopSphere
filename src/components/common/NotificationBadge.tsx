import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { useInAppNotifications } from '@/store/InAppNotificationProvider';

interface NotificationBadgeProps {
  size?: number;
}

export function NotificationBadge({ size = 18 }: NotificationBadgeProps) {
  const { colors } = useTheme();
  const { unreadCount } = useInAppNotifications();

  if (unreadCount === 0) return null;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.error, width: size, height: size, borderRadius: size / 2 },
      ]}
      accessibilityLabel={`${unreadCount} unread notifications`}
    >
      <Text style={[styles.text, { fontSize: size * 0.6 }]}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -4,
    right: -4,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
