import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const mockProducts: Product[] = [
  {
    id: '1', name: 'Wireless Headphones', description: 'Premium noise-cancelling', shortDescription: '', sku: 'WH001',
    brand: { id: '1', name: 'AudioTech' }, categories: [],
    price: { current: 299.99, original: 399.99, currency: 'USD' },
    images: [], variants: [], attributes: [],
    inventory: { quantity: 50, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.5, count: 128, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', name: 'Smart Watch', description: 'Advanced fitness tracking', shortDescription: '', sku: 'SW002',
    brand: { id: '2', name: 'TechWatch' }, categories: [],
    price: { current: 199.99, currency: 'USD' },
    images: [], variants: [], attributes: [],
    inventory: { quantity: 30, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.3, count: 89, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', name: 'Bluetooth Speaker', description: 'Portable waterproof speaker', shortDescription: '', sku: 'BS003',
    brand: { id: '3', name: 'SoundMax' }, categories: [],
    price: { current: 79.99, original: 99.99, currency: 'USD' },
    images: [], variants: [], attributes: [],
    inventory: { quantity: 15, lowStockThreshold: 5, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.6, count: 203, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

interface ProductComparisonScreenProps {
  navigation: any;
  route?: any;
}

export function ProductComparisonScreen({ navigation, route }: ProductComparisonScreenProps) {
  const { colors } = useTheme();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    route?.params?.products || mockProducts.slice(0, 2)
  );
  const [showPicker, setShowPicker] = useState(false);

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = (product: Product) => {
    if (selectedProducts.length >= 3) return;
    if (selectedProducts.some((p) => p.id === product.id)) return;
    setSelectedProducts((prev) => [...prev, product]);
    setShowPicker(false);
  };

  const availableToAdd = mockProducts.filter(
    (p) => !selectedProducts.some((s) => s.id === p.id)
  );

  const comparisonRows = [
    { label: 'Price', getValue: (p: Product) => `$${p.price.current}` },
    { label: 'Original Price', getValue: (p: Product) => (p.price.original ? `$${p.price.original}` : '—') },
    { label: 'Rating', getValue: (p: Product) => `⭐ ${p.ratings.average} (${p.ratings.count})` },
    { label: 'Brand', getValue: (p: Product) => p.brand.name },
    { label: 'In Stock', getValue: (p: Product) => (p.inventory.isInStock ? 'Yes' : 'No') },
    { label: 'Quantity', getValue: (p: Product) => String(p.inventory.quantity) },
    { label: 'Discount', getValue: (p: Product) =>
      p.price.original
        ? `-${Math.round(((p.price.original - p.price.current) / p.price.original) * 100)}%`
        : '—'
    },
  ];

  const colWidth = selectedProducts.length > 0 ? (width - 120) / selectedProducts.length : 0;

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
        <Text style={[styles.title, { color: colors.text }]}>Compare Products</Text>
        {selectedProducts.length < 3 && (
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Add product to compare"
          >
            <Text style={[styles.addButton, { color: colors.primary }]}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>⚖️</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No products to compare</Text>
          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            Add products to compare their features side by side.
          </Text>
          <TouchableOpacity
            style={[styles.shopButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowPicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Add product"
          >
            <Text style={styles.shopButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Header row with product names */}
            <View style={[styles.row, styles.headerRow, { borderBottomColor: colors.border }]}>
              <View style={styles.labelCol}>
                <Text style={[styles.labelText, { color: colors.textSecondary }]}>Product</Text>
              </View>
              {selectedProducts.map((product) => (
                <View key={product.id} style={[styles.productCol, { width: colWidth }]}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productEmoji}>📦</Text>
                    <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeProduct(product.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${product.name} from comparison`}
                    >
                      <Text style={[styles.removeText, { color: colors.error }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Comparison rows */}
            {comparisonRows.map((row, rowIndex) => (
              <View
                key={row.label}
                style={[
                  styles.row,
                  { borderBottomColor: colors.border },
                  rowIndex % 2 === 0 && { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.labelCol}>
                  <Text style={[styles.labelText, { color: colors.textSecondary }]}>{row.label}</Text>
                </View>
                {selectedProducts.map((product) => (
                  <View key={product.id} style={[styles.productCol, { width: colWidth }]}>
                    <Text style={[styles.valueText, { color: colors.text }]}>
                      {row.getValue(product)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Product picker modal */}
      {showPicker && (
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerContent, { backgroundColor: colors.background }]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: colors.text }]}>Add Product</Text>
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                accessibilityRole="button"
                accessibilityLabel="Close product picker"
              >
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {availableToAdd.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                  onPress={() => addProduct(product)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${product.name} to comparison`}
                >
                  <Text style={styles.pickerEmoji}>📦</Text>
                  <View style={styles.pickerInfo}>
                    <Text style={[styles.pickerName, { color: colors.text }]}>{product.name}</Text>
                    <Text style={[styles.pickerPrice, { color: colors.primary }]}>
                      ${product.price.current}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {availableToAdd.length === 0 && (
                <Text style={[styles.noMoreText, { color: colors.textSecondary }]}>
                  All products already added.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      )}
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
  addButton: { fontSize: 16, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  emptyDescription: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  shopButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  shopButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  table: { paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  headerRow: { paddingVertical: 16 },
  labelCol: { width: 100, justifyContent: 'center', paddingHorizontal: 12 },
  labelText: { fontSize: 13, fontWeight: '600' },
  productCol: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  productHeader: { alignItems: 'center', gap: 4 },
  productEmoji: { fontSize: 32 },
  productName: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  removeText: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  valueText: { fontSize: 13, textAlign: 'center' },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pickerTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { fontSize: 20, fontWeight: 'bold' },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  pickerEmoji: { fontSize: 32 },
  pickerInfo: { flex: 1 },
  pickerName: { fontSize: 15, fontWeight: '600' },
  pickerPrice: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  noMoreText: { textAlign: 'center', padding: 20, fontSize: 14 },
});
