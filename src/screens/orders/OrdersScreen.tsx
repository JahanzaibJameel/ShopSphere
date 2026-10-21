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
import { Order, OrderStatus } from '@/types';

const { width } = Dimensions.get('window');

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const statusColors: Record<OrderStatus, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  out_for_delivery: '#10b981',
  delivered: '#22c55e',
  cancelled: '#ef4444',
  refunded: '#6b7280',
};

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    status: 'delivered',
    items: [],
    shippingAddress: {} as any,
    paymentMethod: {} as any,
    subtotal: 299.99,
    tax: 24.0,
    shipping: 9.99,
    discount: 0,
    total: 333.98,
    currency: 'USD',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    status: 'shipped',
    items: [],
    shippingAddress: {} as any,
    paymentMethod: {} as any,
    subtotal: 199.99,
    tax: 16.0,
    shipping: 0,
    discount: 20.0,
    total: 195.99,
    currency: 'USD',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    status: 'processing',
    items: [],
    shippingAddress: {} as any,
    paymentMethod: {} as any,
    subtotal: 89.99,
    tax: 7.2,
    shipping: 5.99,
    discount: 0,
    total: 103.18,
    currency: 'USD',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    status: 'cancelled',
    items: [],
    shippingAddress: {} as any,
    paymentMethod: {} as any,
    subtotal: 49.99,
    tax: 4.0,
    shipping: 5.99,
    discount: 0,
    total: 59.98,
    currency: 'USD',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface OrdersScreenProps {
  navigation: any;
}

export function OrdersScreen({ navigation }: OrdersScreenProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredOrders = useMemo(() => {
    let result = [...mockOrders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((o) => new Date(o.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.createdAt) <= to);
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [searchQuery, statusFilter, dateFrom, dateTo]);

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => handleOrderPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Order ${item.orderNumber}, status ${statusLabels[item.status]}, total $${item.total}`}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderNumber, { color: colors.text }]}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
          <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        <Text style={[styles.orderTotal, { color: colors.primary }]}>
          ${item.total.toFixed(2)}
        </Text>
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Status</Text>
            <View style={styles.statusGrid}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  statusFilter === 'all' && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setStatusFilter('all')}
                accessibilityRole="button"
                accessibilityLabel="Filter by all statuses"
                accessibilityState={{ selected: statusFilter === 'all' }}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    { color: statusFilter === 'all' ? '#ffffff' : colors.text },
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {(Object.keys(statusLabels) as OrderStatus[]).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    statusFilter === status && {
                      backgroundColor: statusColors[status],
                      borderColor: statusColors[status],
                    },
                  ]}
                  onPress={() => setStatusFilter(status)}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${statusLabels[status]}`}
                  accessibilityState={{ selected: statusFilter === status }}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      { color: statusFilter === status ? '#ffffff' : colors.text },
                    ]}
                  >
                    {statusLabels[status]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterSectionTitle, { color: colors.text, marginTop: 20 }]}>
              Date Range
            </Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>From</Text>
                <TextInput
                  style={[
                    styles.dateField,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                  ]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textTertiary}
                  value={dateFrom}
                  onChangeText={setDateFrom}
                  accessibilityLabel="Filter from date"
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>To</Text>
                <TextInput
                  style={[
                    styles.dateField,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                  ]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textTertiary}
                  value={dateTo}
                  onChangeText={setDateTo}
                  accessibilityLabel="Filter to date"
                />
              </View>
            </View>

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
              onPress={() => {
                setStatusFilter('all');
                setDateFrom('');
                setDateTo('');
                setSearchQuery('');
              }}
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No orders found</Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        {searchQuery || statusFilter !== 'all' || dateFrom || dateTo
          ? 'Try adjusting your filters.'
          : 'You haven\'t placed any orders yet.'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Search by order number or status..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search orders"
        />
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowFilters(true)}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Text style={styles.filterButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {(statusFilter !== 'all' || dateFrom || dateTo) && (
        <View style={styles.activeFilters}>
          {statusFilter !== 'all' && (
            <View style={[styles.activeFilterChip, { backgroundColor: statusColors[statusFilter] + '20' }]}>
              <Text style={[styles.activeFilterText, { color: statusColors[statusFilter] }]}>
                {statusLabels[statusFilter]}
              </Text>
            </View>
          )}
          {dateFrom && (
            <View style={[styles.activeFilterChip, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.activeFilterText, { color: colors.primary }]}>
                From: {dateFrom}
              </Text>
            </View>
          )}
          {dateTo && (
            <View style={[styles.activeFilterChip, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.activeFilterText, { color: colors.primary }]}>
                To: {dateTo}
              </Text>
            </View>
          )}
        </View>
      )}

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: 'bold' },
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: { fontSize: 20 },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 6,
  },
  activeFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeFilterText: { fontSize: 12, fontWeight: '600' },
  listContent: { padding: 20, paddingTop: 4 },
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
  orderNumber: { fontSize: 16, fontWeight: '600' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: { fontSize: 13 },
  orderTotal: { fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  emptyDescription: { fontSize: 14, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
  filterSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusOptionText: { fontSize: 13, fontWeight: '500' },
  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  dateInput: { flex: 1 },
  dateLabel: { fontSize: 13, marginBottom: 4 },
  dateField: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
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
