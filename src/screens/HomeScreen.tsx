import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { useAuth } from '@/store/AuthProvider';
import { Product, Category } from '@/types';

const { width } = Dimensions.get('window');

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', level: 1, isActive: true },
  { id: '2', name: 'Fashion', slug: 'fashion', level: 1, isActive: true },
  { id: '3', name: 'Home & Garden', slug: 'home-garden', level: 1, isActive: true },
  { id: '4', name: 'Sports', slug: 'sports', level: 1, isActive: true },
  { id: '5', name: 'Books', slug: 'books', level: 1, isActive: true },
  { id: '6', name: 'Toys', slug: 'toys', level: 1, isActive: true },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones',
    shortDescription: 'Best sound quality',
    sku: 'WH001',
    brand: { id: '1', name: 'AudioTech' },
    categories: [mockCategories[0]],
    price: { current: 299.99, original: 399.99, currency: 'USD' },
    images: [
      { id: '1', url: 'https://picsum.photos/seed/headphones/400/400.jpg', alt: 'Headphones', order: 1, type: 'main' }
    ],
    variants: [],
    attributes: [],
    inventory: { quantity: 50, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true },
    ratings: { average: 4.5, count: 128, distribution: {} },
    seo: { title: 'Wireless Headphones', description: 'Premium headphones', keywords: [] },
    tags: ['wireless', 'audio', 'premium'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Advanced fitness tracking watch',
    shortDescription: 'Track your fitness',
    sku: 'SW002',
    brand: { id: '2', name: 'TechWatch' },
    categories: [mockCategories[0]],
    price: { current: 199.99, currency: 'USD' },
    images: [
      { id: '2', url: 'https://picsum.photos/seed/watch/400/400.jpg', alt: 'Smart Watch', order: 1, type: 'main' }
    ],
    variants: [],
    attributes: [],
    inventory: { quantity: 30, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true },
    ratings: { average: 4.3, count: 89, distribution: {} },
    seo: { title: 'Smart Watch', description: 'Fitness watch', keywords: [] },
    tags: ['smart', 'fitness', 'watch'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    // Load data
    loadData();
  }, []);

  const loadData = async () => {
    // Simulate API calls
    console.log('Loading home data...');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to category screen
    console.log('Category pressed:', category.name);
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.greeting, { color: colors.white }]}>
            Hello, {user?.firstName || 'Guest'}! 👋
          </Text>
          <Text style={[styles.subGreeting, { color: colors.white, opacity: 0.9 }]}>
            What are you shopping for today?
          </Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {mockCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              { backgroundColor: colors.surface, borderColor: colors.border }
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.categoryEmoji}>
                {category.name === 'Electronics' ? '📱' :
                 category.name === 'Fashion' ? '👗' :
                 category.name === 'Home & Garden' ? '🏠' :
                 category.name === 'Sports' ? '⚽' :
                 category.name === 'Books' ? '📚' : '🧸'}
              </Text>
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={[
        styles.productCard,
        { backgroundColor: colors.surface, borderColor: colors.border }
      ]}
      onPress={() => handleProductPress(product)}
    >
      <View style={styles.productImageContainer}>
        <Text style={styles.productImagePlaceholder}>📦</Text>
        {product.price.original && (
          <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
            <Text style={[styles.discountText, { color: '#ffffff' }]}>
              -{Math.round(((product.price.original - product.price.current) / product.price.original) * 100)}%
            </Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.productBrand, { color: colors.textSecondary }]}>
          {product.brand.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, { color: colors.primary }]}>
            ${product.price.current}
          </Text>
          {product.price.original && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              ${product.price.original}
            </Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStars}>⭐ {product.ratings.average}</Text>
          <Text style={[styles.ratingCount, { color: colors.textSecondary }]}>
            ({product.ratings.count})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedProducts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
        {featuredProducts.map(renderProductCard)}
      </ScrollView>
    </View>
  );

  const renderTrendingProducts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
        {trendingProducts.map(renderProductCard)}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {renderCategories()}
        {renderFeaturedProducts()}
        {renderTrendingProducts()}
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  productsContainer: {
    flexDirection: 'row',
  },
  productCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImagePlaceholder: {
    fontSize: 48,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
  },
  spacer: {
    height: 20,
  },
});
