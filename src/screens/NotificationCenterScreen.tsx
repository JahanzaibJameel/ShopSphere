import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { useInAppNotifications } from '@/store/InAppNotificationProvider';
import { Notification } from '@/types';

const { width } = Dimensions.get('window');

const typeIcons: Record<string, string> = {
  order: '📦',
  promotion: '🎉',
  delivery: '🚚',
  system: '🔔',
};

const typeColors: Record<string, string> = {
  order: '#3b82f6',
  promotion: '#f59e0b',
  delivery: '#10b981',
  system: '#6b7280',
};

interface NotificationCenterScreenProps {
  navigation: any;
}

export function NotificationCenterScreen({ navigation }: NotificationCenterScreenProps) {
  const { colors } = useTheme();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useInAppNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // Navigate based on type
    if (notification.data?.orderId) {
      navigation.navigate('OrderDetails', { orderId: notification.data.orderId });
    } else if (notification.data?.productId) {
      navigation.navigate('ProductDetails', { productId: notification.data.productId });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Notification', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeNotification(id) },
    ]);
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    Alert.alert('Clear All', 'Remove all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAll },
    ]);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        { backgroundColor: item.isRead ? colors.background : colors.surface, borderColor: colors.border },
      ]}
      onPress={() => handleNotificationPress(item)}
      onLongPress={() => handleDelete(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.body}. ${item.isRead ? 'Read' : 'Unread'}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: (typeColors[item.type] || colors.primary) + '20' }]}>
        <Text style={styles.icon}>{typeIcons[item.type] || '🔔'}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.notificationTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
        </View>
        <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={[styles.time, { color: colors.textTertiary }]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔕</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No notifications
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        You're all caught up! Check back later.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            accessibilityRole="button"
            accessibilityLabel="Clear all notifications"
          >
            <Text style={[styles.clearText, { color: colors.error }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('all')}
          accessibilityRole="button"
          accessibilityLabel="Show all notifications"
          accessibilityState={{ selected: filter === 'all' }}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? '#ffffff' : colors.textSecondary },
            ]}
          >
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'unread' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('unread')}
          accessibilityRole="button"
          accessibilityLabel="Show unread notifications"
          accessibilityState={{ selected: filter === 'unread' }}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'unread' ? '#ffffff' : colors.textSecondary },
            ]}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
            accessibilityRole="button"
            accessibilityLabel="Mark all as read"
          >
            <Text style={[styles.markAllText, { color: colors.primary }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  clearText: { fontSize: 14, fontWeight: '600' },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterText: { fontSize: 13, fontWeight: '500' },
  markAllButton: { marginLeft: 'auto' },
  markAllText: { fontSize: 13, fontWeight: '600' },
  listContent: { padding: 16, paddingTop: 4 },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  notificationTitle: { fontSize: 15, fontWeight: '600', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  body: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  time: { fontSize: 11 },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  emptyDescription: { fontSize: 14 },
});
