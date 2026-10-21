import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { PaymentMethod } from '@/types';

const { width } = Dimensions.get('window');

const mockCards: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    isDefault: true,
    card: { last4: '4242', brand: 'Visa', expiryMonth: '12', expiryYear: '2025' },
  },
  {
    id: '2',
    type: 'card',
    isDefault: false,
    card: { last4: '5555', brand: 'Mastercard', expiryMonth: '08', expiryYear: '2026' },
  },
  {
    id: '3',
    type: 'paypal',
    isDefault: false,
  },
];

const brandIcons: Record<string, string> = {
  Visa: '💳',
  Mastercard: '💳',
  'American Express': '💳',
  Discover: '💳',
};

const typeLabels: Record<string, string> = {
  card: 'Credit/Debit Card',
  paypal: 'PayPal',
  'apple-pay': 'Apple Pay',
  'google-pay': 'Google Pay',
};

interface PaymentMethodsScreenProps {
  navigation: any;
}

export function PaymentMethodsScreen({ navigation }: PaymentMethodsScreenProps) {
  const { colors } = useTheme();
  const [methods, setMethods] = useState<PaymentMethod[]>(mockCards);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      isDefault: false,
    });
  };

  const detectBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'American Express';
    if (cleaned.startsWith('6')) return 'Discover';
    return 'Card';
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAddCard = () => {
    const cleaned = formData.cardNumber.replace(/\s/g, '');
    if (cleaned.length < 13) {
      Alert.alert('Invalid Card', 'Please enter a valid card number.');
      return;
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      Alert.alert('Invalid Expiry', 'Please enter the expiry date.');
      return;
    }
    if (formData.cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV.');
      return;
    }
    if (!formData.cardholderName.trim()) {
      Alert.alert('Missing Name', 'Please enter the cardholder name.');
      return;
    }

    const brand = detectBrand(cleaned);
    const newMethod: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: 'card',
      isDefault: formData.isDefault || methods.length === 0,
      card: {
        last4: cleaned.slice(-4),
        brand,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
      },
    };

    setMethods((prev) => {
      const updated = formData.isDefault
        ? prev.map((m) => ({ ...m, isDefault: false }))
        : prev;
      return [newMethod, ...updated];
    });

    setShowAddModal(false);
    resetForm();
    Alert.alert('Success', 'Card added successfully.');
  };

  const handleDelete = (method: PaymentMethod) => {
    Alert.alert(
      'Remove Payment Method',
      `Remove ${method.type === 'card' ? method.card?.brand + ' ending in ' + method.card?.last4 : typeLabels[method.type]}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setMethods((prev) => prev.filter((m) => m.id !== method.id));
            if (method.isDefault && methods.length > 1) {
              setMethods((prev) => {
                const updated = [...prev];
                if (updated.length > 0) updated[0].isDefault = true;
                return updated;
              });
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const renderMethodCard = ({ item }: { item: PaymentMethod }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.typeRow}>
          <Text style={styles.brandIcon}>
            {item.type === 'card' ? brandIcons[item.card?.brand || ''] || '💳' : '💰'}
          </Text>
          <View>
            <Text style={[styles.brandName, { color: colors.text }]}>
              {item.type === 'card'
                ? `${item.card?.brand} •••• ${item.card?.last4}`
                : typeLabels[item.type]}
            </Text>
            {item.type === 'card' && (
              <Text style={[styles.expiry, { color: colors.textSecondary }]}>
                Expires {item.card?.expiryMonth}/{item.card?.expiryYear}
              </Text>
            )}
          </View>
        </View>
        {item.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            onPress={() => handleSetDefault(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Set ${item.type === 'card' ? item.card?.brand : typeLabels[item.type]} as default`}
          >
            <Text style={[styles.actionText, { color: colors.primary }]}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: colors.border }]}
          onPress={() => handleDelete(item)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.type === 'card' ? item.card?.brand : typeLabels[item.type]}`}
        >
          <Text style={[styles.actionText, { color: colors.error }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💳</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No payment methods</Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        Add a card or payment method for faster checkout.
      </Text>
    </View>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setShowAddModal(false);
        resetForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Card</Text>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
              accessibilityRole="button"
              accessibilityLabel="Close add card form"
            >
              <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Card Number *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.textTertiary}
                value={formData.cardNumber}
                onChangeText={(v) => setFormData((p) => ({ ...p, cardNumber: formatCardNumber(v) }))}
                keyboardType="numeric"
                maxLength={19}
                accessibilityLabel="Card number input"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Expiry Month *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  placeholder="MM"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.expiryMonth}
                  onChangeText={(v) => setFormData((p) => ({ ...p, expiryMonth: v.replace(/\D/g, '').slice(0, 2) }))}
                  keyboardType="numeric"
                  maxLength={2}
                  accessibilityLabel="Expiry month input"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Expiry Year *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  placeholder="YY"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.expiryYear}
                  onChangeText={(v) => setFormData((p) => ({ ...p, expiryYear: v.replace(/\D/g, '').slice(0, 2) }))}
                  keyboardType="numeric"
                  maxLength={2}
                  accessibilityLabel="Expiry year input"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>CVV *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  placeholder="123"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.cvv}
                  onChangeText={(v) => setFormData((p) => ({ ...p, cvv: v.replace(/\D/g, '').slice(0, 4) }))}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  accessibilityLabel="CVV input"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Cardholder Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="John Doe"
                placeholderTextColor={colors.textTertiary}
                value={formData.cardholderName}
                onChangeText={(v) => setFormData((p) => ({ ...p, cardholderName: v }))}
                autoCapitalize="words"
                accessibilityLabel="Cardholder name input"
              />
            </View>

            <TouchableOpacity
              style={styles.defaultToggle}
              onPress={() => setFormData((p) => ({ ...p, isDefault: !p.isDefault }))}
              accessibilityRole="checkbox"
              accessibilityLabel="Set as default payment method"
              accessibilityState={{ checked: formData.isDefault }}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.border },
                  formData.isDefault && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                {formData.isDefault && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.defaultToggleText, { color: colors.text }]}>
                Set as default payment method
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleAddCard}
              accessibilityRole="button"
              accessibilityLabel="Add card"
            >
              <Text style={styles.saveButtonText}>Add Card</Text>
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
        <Text style={[styles.title, { color: colors.text }]}>Payment Methods</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Add new payment method"
        >
          <Text style={[styles.addButton, { color: colors.primary }]}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {methods.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={methods}
          renderItem={renderMethodCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderAddModal()}
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
  listContent: { padding: 20, paddingTop: 4 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandIcon: { fontSize: 28 },
  brandName: { fontSize: 16, fontWeight: '600' },
  expiry: { fontSize: 13, marginTop: 2 },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultText: { fontSize: 11, fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  actionButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: { fontSize: 13, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
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
    maxHeight: '90%',
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
  fieldGroup: { marginBottom: 12 },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  row: { flexDirection: 'row', gap: 8 },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  defaultToggleText: { fontSize: 14 },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
