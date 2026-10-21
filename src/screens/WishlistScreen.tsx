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
import { useWishlist } from '@/store/WishlistProvider';
import { Product } from '@/types';
import { FavoriteButton } from '@/components/common/FavoriteButton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface WishlistScreenProps {
  navigation: any;
}

export function WishlistScreen({ navigation }: WishlistScreenProps) {
  const { colors } = useTheme();
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const [refreshing, setRefreshing] = useState(false);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  const handleRemove = (product: Product) => {
    Alert.alert(
      'Remove from Wishlist',
      `Remove "${product.name}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromWishlist(product.id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    Alert.alert(
      'Clear Wishlist',
      'Remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearWishlist },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => handleProductPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name} by ${item.brand.name}, $${item.price.current}`}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>📦</Text>
        {item.price.original && (
          <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
            <Text style={[styles.discountText, { color: '#ffffff' }]}>
              -{Math.round(((item.price.original - item.price.current) / item.price.original) * 100)}%
            </Text>
          </View>
        )}
        <View style={styles.favoriteWrapper}>
          <FavoriteButton product={item} size={20} />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.brand, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.brand.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${item.price.current}
          </Text>
          {item.price.original && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              ${item.price.original}
            </Text>
          )}
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>⭐ {item.ratings.average}</Text>
          <Text style={[styles.ratingCount, { color: colors.textSecondary }]}>
            ({item.ratings.count})
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.removeButton, { borderColor: colors.border }]}
        onPress={() => handleRemove(item)}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item.name} from wishlist`}
      >
        <Text style={[styles.removeText, { color: colors.error }]}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💔</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Your wishlist is empty
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        Tap the heart icon on products to save them here.
      </Text>
      <TouchableOpacity
        style={[styles.shopButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Home')}
        accessibilityRole="button"
        accessibilityLabel="Start shopping"
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Wishlist</Text>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            accessibilityRole="button"
            accessibilityLabel="Clear all wishlist items"
          >
            <Text style={[styles.clearText, { color: colors.error }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Text style={[styles.countText, { color: colors.textSecondary }]}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
          <FlatList
            data={items}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  countText: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imagePlaceholder: {
    fontSize: 48,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteWrapper: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  brand: {
    fontSize: 12,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
  },
  removeButton: {
    borderTopWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  removeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
