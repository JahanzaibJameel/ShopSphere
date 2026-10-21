import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { Product } from '@/types';
import { MMKV } from 'react-native-mmkv';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 140;

const storage = new MMKV({ id: 'recently-viewed-storage' });
const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 20;

export function useRecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = storage.getString(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading recently viewed:', e);
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      try {
        storage.set(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving recently viewed:', e);
      }
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    storage.delete(STORAGE_KEY);
  }, []);

  return { items, addProduct, clearAll };
}

interface RecentlyViewedProps {
  items: Product[];
  onProductPress: (product: Product) => void;
  onClear?: () => void;
  title?: string;
}

export function RecentlyViewed({
  items,
  onProductPress,
  onClear,
  title = 'Recently Viewed',
}: RecentlyViewedProps) {
  const { colors } = useTheme();

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {onClear && (
          <TouchableOpacity
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear recently viewed"
          >
            <Text style={[styles.clearText, { color: colors.textSecondary }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onProductPress(product)}
            accessibilityRole="button"
            accessibilityLabel={`${product.name}, $${product.price.current}`}
          >
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholder}>📦</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={[styles.price, { color: colors.primary }]}>
                ${product.price.current}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  clearText: { fontSize: 13, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 20 },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: { fontSize: 36 },
  info: { padding: 8 },
  name: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 14, fontWeight: 'bold' },
});
