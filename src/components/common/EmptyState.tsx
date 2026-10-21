import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

const { width } = Dimensions.get('window');

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
      {secondaryLabel && onSecondary && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSecondary}
          accessibilityRole="button"
          accessibilityLabel={secondaryLabel}
        >
          <Text style={[styles.secondaryText, { color: colors.primary }]}>
            {secondaryLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Pre-configured empty states for common screens
export function EmptyCart({ onShop }: { onShop?: () => void }) {
  return (
    <EmptyState
      emoji="🛒"
      title="Your cart is empty"
      description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
      actionLabel="Start Shopping"
      onAction={onShop}
    />
  );
}

export function EmptyWishlist({ onShop }: { onShop?: () => void }) {
  return (
    <EmptyState
      emoji="💔"
      title="Your wishlist is empty"
      description="Tap the heart icon on products to save them here for later."
      actionLabel="Browse Products"
      onAction={onShop}
    />
  );
}

export function EmptyOrders({ onShop }: { onShop?: () => void }) {
  return (
    <EmptyState
      emoji="📋"
      title="No orders yet"
      description="You haven't placed any orders yet. Start shopping to see your order history here."
      actionLabel="Start Shopping"
      onAction={onShop}
    />
  );
}

export function EmptySearch({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      emoji="🔍"
      title="No results found"
      description="We couldn't find any products matching your search. Try different keywords or filters."
      actionLabel="Clear Filters"
      onAction={onClear}
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      emoji="🔕"
      title="No notifications"
      description="You're all caught up! Check back later for updates."
    />
  );
}

export function EmptyReviews({ onWrite }: { onWrite?: () => void }) {
  return (
    <EmptyState
      emoji="📝"
      title="No reviews yet"
      description="Be the first to share your thoughts about this product!"
      actionLabel="Write a Review"
      onAction={onWrite}
    />
  );
}

export function EmptyAddresses({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      emoji="📍"
      title="No addresses saved"
      description="Add a shipping address to speed up checkout."
      actionLabel="Add Address"
      onAction={onAdd}
    />
  );
}

export function EmptyPaymentMethods({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      emoji="💳"
      title="No payment methods"
      description="Add a card or payment method for faster checkout."
      actionLabel="Add Card"
      onAction={onAdd}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  description: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { paddingVertical: 8 },
  secondaryText: { fontSize: 14, fontWeight: '600' },
});
