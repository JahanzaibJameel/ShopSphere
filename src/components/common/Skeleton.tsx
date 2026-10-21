import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

const { width } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 4, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Skeleton width="100%" height={120} borderRadius={0} />
      <View style={styles.cardBody}>
        <Skeleton width="80%" height={14} borderRadius={4} />
        <Skeleton width="50%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
        <View style={styles.priceRow}>
          <Skeleton width={60} height={16} borderRadius={4} />
          <Skeleton width={40} height={12} borderRadius={4} />
        </View>
        <Skeleton width={80} height={12} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function ListItemSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.listItemContent}>
        <Skeleton width="70%" height={14} borderRadius={4} />
        <Skeleton width="40%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
      <Skeleton width={60} height={14} borderRadius={4} />
    </View>
  );
}

export function OrderCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.orderHeader}>
        <Skeleton width={120} height={16} borderRadius={4} />
        <Skeleton width={80} height={20} borderRadius={10} />
      </View>
      <View style={styles.orderFooter}>
        <Skeleton width={100} height={13} borderRadius={4} />
        <Skeleton width={70} height={16} borderRadius={4} />
      </View>
    </View>
  );
}

export function ProfileSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={styles.profileContainer}>
      <Skeleton width={80} height={80} borderRadius={40} />
      <Skeleton width={160} height={20} borderRadius={4} style={{ marginTop: 12 }} />
      <Skeleton width={120} height={14} borderRadius={4} style={{ marginTop: 6 }} />
      <View style={styles.profileStats}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.statItem}>
            <Skeleton width={40} height={20} borderRadius={4} />
            <Skeleton width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {},
  card: {
    width: (width - 48) / 2,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardBody: { padding: 10 },
  priceRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  listItemContent: { flex: 1 },
  orderCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: { alignItems: 'center', padding: 20 },
  profileStats: { flexDirection: 'row', gap: 24, marginTop: 20 },
  statItem: { alignItems: 'center' },
});
