import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { Product, Category } from '@/types';
import { StarRating } from '@/components/common/StarRating';

const { width } = Dimensions.get('window');

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', level: 1, isActive: true },
  { id: '2', name: 'Fashion', slug: 'fashion', level: 1, isActive: true },
  { id: '3', name: 'Home & Garden', slug: 'home-garden', level: 1, isActive: true },
  { id: '4', name: 'Sports', slug: 'sports', level: 1, isActive: true },
];

const mockProducts: Product[] = [
  {
    id: '1', name: 'Wireless Headphones', description: '', shortDescription: '', sku: 'WH001',
    brand: { id: '1', name: 'AudioTech' }, categories: [mockCategories[0]],
    price: { current: 299.99, original: 399.99, currency: 'USD' },
    images: [{ id: '1', url: '', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 50, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.5, count: 128, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', name: 'Smart Watch', description: '', shortDescription: '', sku: 'SW002',
    brand: { id: '2', name: 'TechWatch' }, categories: [mockCategories[0]],
    price: { current: 199.99, currency: 'USD' },
    images: [{ id: '2', url: '', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 30, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.3, count: 89, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', name: 'Running Shoes', description: '', shortDescription: '', sku: 'RS003',
    brand: { id: '3', name: 'SportFit' }, categories: [mockCategories[3]],
    price: { current: 89.99, original: 129.99, currency: 'USD' },
    images: [{ id: '3', url: '', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 20, lowStockThreshold: 5, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.7, count: 256, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '4', name: 'Cotton T-Shirt', description: '', shortDescription: '', sku: 'TS004',
    brand: { id: '4', name: 'FashionCo' }, categories: [mockCategories[1]],
    price: { current: 24.99, currency: 'USD' },
    images: [{ id: '4', url: '', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 100, lowStockThreshold: 20, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.0, count: 45, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';

interface SearchFiltersState {
  query: string;
  categories: string[];
  priceMin: string;
  priceMax: string;
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;
}

interface SearchScreenProps {
  navigation: any;
  route?: any;
}

export function SearchScreen({ navigation, route }: SearchScreenProps) {
  const { colors } = useTheme();
  const initialQuery = route?.params?.query || '';

  const [filters, setFilters] = useState<SearchFiltersState>({
    query: initialQuery,
    categories: [],
    priceMin: '',
    priceMax: '',
    minRating: 0,
    inStockOnly: false,
    sortBy: 'relevance',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState(initialQuery);

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        p.categories.some((c) => filters.categories.includes(c.id))
      );
    }

    if (filters.priceMin) {
      result = result.filter((p) => p.price.current >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((p) => p.price.current <= parseFloat(filters.priceMax));
    }

    if (filters.minRating > 0) {
      result = result.filter((p) => p.ratings.average >= filters.minRating);
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.inventory.isInStock);
    }

    switch (filters.sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price.current - b.price.current);
        break;
      case 'price_high':
        result.sort((a, b) => b.price.current - a.price.current);
        break;
      case 'rating':
        result.sort((a, b) => b.ratings.average - a.ratings.average);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [filters]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, query: searchText }));
  };

  const toggleCategory = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const activeFilterCount =
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={`${item.name} by ${item.brand.name}, $${item.price.current}, rated ${item.ratings.average} stars`}
    >
      <View style={styles.productImage}>
        <Text style={styles.productImagePlaceholder}>📦</Text>
        {item.price.original && (
          <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
            <Text style={[styles.discountText, { color: '#ffffff' }]}>
              -{Math.round(((item.price.original - item.price.current) / item.price.original) * 100)}%
            </Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.productBrand, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.brand.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>${item.price.current}</Text>
          {item.price.original && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              ${item.price.original}
            </Text>
          )}
        </View>
        <StarRating rating={item.ratings.average} size={12} showValue />
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters & Sort</Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Sort */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sort By</Text>
            <View style={styles.sortGrid}>
              {(
                [
                  { key: 'relevance', label: 'Relevance' },
                  { key: 'price_low', label: 'Price: Low to High' },
                  { key: 'price_high', label: 'Price: High to Low' },
                  { key: 'rating', label: 'Highest Rated' },
                  { key: 'newest', label: 'Newest' },
                ] as { key: SortOption; label: string }[]
              ).map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.sortOption,
                    filters.sortBy === key && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setFilters((p) => ({ ...p, sortBy: key }))}
                  accessibilityRole="button"
                  accessibilityLabel={`Sort by ${label}`}
                  accessibilityState={{ selected: filters.sortBy === key }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      { color: filters.sortBy === key ? '#ffffff' : colors.text },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Categories */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Categories</Text>
            <View style={styles.categoryGrid}>
              {mockCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    filters.categories.includes(cat.id) && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => toggleCategory(cat.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${cat.name}`}
                  accessibilityState={{ selected: filters.categories.includes(cat.id) }}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: filters.categories.includes(cat.id) ? '#ffffff' : colors.text },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Price Range</Text>
<View style={styles.priceRangeRow}>
              <TextInput
                style={[styles.priceInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="Min"
                placeholderTextColor={colors.textTertiary}
                value={filters.priceMin}
                onChangeText={(v) => setFilters((p) => ({ ...p, priceMin: v.replace(/[^0-9.]/g, '') }))}
                keyboardType="numeric"
                accessibilityLabel="Minimum price"
              />
              <Text style={[styles.priceSeparator, { color: colors.textSecondary }]}>—</Text>
              <TextInput
                style={[styles.priceInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="Max"
                placeholderTextColor={colors.textTertiary}
                value={filters.priceMax}
                onChangeText={(v) => setFilters((p) => ({ ...p, priceMax: v.replace(/[^0-9.]/g, '') }))}
                keyboardType="numeric"
                accessibilityLabel="Maximum price"
              />
            </View>

            {/* Rating */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Minimum Rating</Text>
            <View style={styles.ratingRow}>
              {[0, 3, 3.5, 4, 4.5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingChip,
                    filters.minRating === rating && { backgroundColor: colors.warning, borderColor: colors.warning },
                  ]}
                  onPress={() => setFilters((p) => ({ ...p, minRating: rating }))}
                  accessibilityRole="button"
                  accessibilityLabel={rating === 0 ? 'Any rating' : `${rating} stars and up`}
                  accessibilityState={{ selected: filters.minRating === rating }}
                >
                  <Text
                    style={[
                      styles.ratingChipText,
                      { color: filters.minRating === rating ? '#ffffff' : colors.text },
                    ]}
                  >
                    {rating === 0 ? 'Any' : `${rating}+ ★`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* In Stock */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setFilters((p) => ({ ...p, inStockOnly: !p.inStockOnly }))}
              accessibilityRole="checkbox"
              accessibilityLabel="In stock only"
              accessibilityState={{ checked: filters.inStockOnly }}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.border },
                  filters.inStockOnly && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                {filters.inStockOnly && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>In stock only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilters(false)}
              accessibilityRole="button"
              accessibilityLabel="Apply filters"
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() =>
                setFilters({
                  query: filters.query,
                  categories: [],
                  priceMin: '',
                  priceMax: '',
                  minRating: 0,
                  inStockOnly: false,
                  sortBy: 'relevance',
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Reset all filters"
            >
              <Text style={[styles.resetButtonText, { color: colors.error }]}>Reset All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Search products..."
          placeholderTextColor={colors.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          accessibilityLabel="Search input"
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilterCount > 0 && { backgroundColor: colors.primary },
          ]}
          onPress={() => setShowFilters(true)}
          accessibilityRole="button"
          accessibilityLabel={`Open filters, ${activeFilterCount} active`}
        >
          <Text style={styles.filterButtonText}>⚙️</Text>
          {activeFilterCount > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: colors.error }]}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {filters.query && (
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{filters.query}"
        </Text>
      )}

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No products found</Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              Try adjusting your search or filters.
            </Text>
          </View>
        }
      />

      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: { fontSize: 16, fontWeight: '600', marginRight: 12 },
  title: { fontSize: 20, fontWeight: 'bold' },
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: { fontSize: 18 },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonText: { fontSize: 20 },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  resultsText: { paddingHorizontal: 20, marginBottom: 8, fontSize: 13 },
  listContent: { padding: 16, paddingTop: 4 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  productCard: {
    width: (width - 48) / 2,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImagePlaceholder: { fontSize: 40 },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: { fontSize: 9, fontWeight: 'bold' },
  productInfo: { padding: 10 },
  productName: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  productBrand: { fontSize: 11, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  price: { fontSize: 14, fontWeight: 'bold' },
  originalPrice: { fontSize: 11, textDecorationLine: 'line-through' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, width },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  emptyDescription: { fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  sortGrid: { gap: 8 },
  sortOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortOptionText: { fontSize: 14 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipText: { fontSize: 13, fontWeight: '500' },
  priceRangeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  priceSeparator: { fontSize: 16 },
  ratingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ratingChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ratingChipText: { fontSize: 13, fontWeight: '500' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  toggleLabel: { fontSize: 14 },
  applyButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  applyButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  resetButton: { paddingVertical: 10, alignItems: 'center' },
  resetButtonText: { fontSize: 14, fontWeight: '600' },
});
