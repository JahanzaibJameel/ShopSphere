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
import { Address } from '@/types';

const { width } = Dimensions.get('window');

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    isDefault: true,
    street: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  {
    id: '2',
    type: 'work',
    isDefault: false,
    street: '456 Office Blvd, Suite 200',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    country: 'United States',
  },
];

const typeIcons: Record<string, string> = {
  home: '🏠',
  work: '🏢',
  other: '📍',
};

interface AddressBookScreenProps {
  navigation: any;
}

export function AddressBookScreen({ navigation }: AddressBookScreenProps) {
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'home' as Address['type'],
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id
            ? { ...a, ...formData }
            : formData.isDefault
            ? { ...a, isDefault: false }
            : a
        )
      );
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        ...formData,
      };
      setAddresses((prev) => {
        const updated = formData.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [newAddress, ...updated];
      });
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (address: Address) => {
    Alert.alert(
      'Delete Address',
      `Remove ${address.street} from your address book?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses((prev) => prev.filter((a) => a.id !== address.id));
            if (address.isDefault && addresses.length > 1) {
              setAddresses((prev) => {
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
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const renderAddressCard = ({ item }: { item: Address }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.typeRow}>
          <Text style={styles.typeIcon}>{typeIcons[item.type]}</Text>
          <Text style={[styles.typeLabel, { color: colors.text }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          {item.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${item.type} address`}
          >
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${item.type} address`}
          >
            <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.street, { color: colors.text }]}>{item.street}</Text>
      <Text style={[styles.cityLine, { color: colors.textSecondary }]}>
        {item.city}, {item.state} {item.zipCode}
      </Text>
      <Text style={[styles.country, { color: colors.textSecondary }]}>{item.country}</Text>

      {!item.isDefault && (
        <TouchableOpacity
          style={[styles.setDefaultButton, { borderColor: colors.border }]}
          onPress={() => handleSetDefault(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Set ${item.type} address as default`}
        >
          <Text style={[styles.setDefaultText, { color: colors.primary }]}>
            Set as Default
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📍</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No addresses saved</Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        Add a shipping address to speed up checkout.
      </Text>
    </View>
  );

  const renderFormModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setShowModal(false);
        resetForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingAddress ? 'Edit Address' : 'Add Address'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                resetForm();
              }}
              accessibilityRole="button"
              accessibilityLabel="Close address form"
            >
              <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Address Type</Text>
            <View style={styles.typeSelector}>
              {(['home', 'work', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    formData.type === type && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, type }))}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${type} address type`}
                  accessibilityState={{ selected: formData.type === type }}
                >
                  <Text style={styles.typeOptionIcon}>{typeIcons[type]}</Text>
                  <Text
                    style={[
                      styles.typeOptionText,
                      { color: formData.type === type ? '#ffffff' : colors.text },
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {[
              { key: 'street', label: 'Street Address *', placeholder: '123 Main St, Apt 4B' },
              { key: 'city', label: 'City *', placeholder: 'New York' },
              { key: 'state', label: 'State/Province *', placeholder: 'NY' },
              { key: 'zipCode', label: 'ZIP/Postal Code *', placeholder: '10001' },
              { key: 'country', label: 'Country', placeholder: 'United States' },
            ].map(({ key, label, placeholder }) => (
              <View key={key} style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
                  ]}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textTertiary}
                  value={formData[key as keyof typeof formData] as string}
                  onChangeText={(value) =>
                    setFormData((prev) => ({ ...prev, [key]: value }))
                  }
                  accessibilityLabel={label}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.defaultToggle}
              onPress={() => setFormData((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
              accessibilityRole="checkbox"
              accessibilityLabel="Set as default address"
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
                Set as default address
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel={editingAddress ? 'Update address' : 'Save address'}
            >
              <Text style={styles.saveButtonText}>
                {editingAddress ? 'Update Address' : 'Save Address'}
              </Text>
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
        <Text style={[styles.title, { color: colors.text }]}>Address Book</Text>
        <TouchableOpacity
          onPress={openAddModal}
          accessibilityRole="button"
          accessibilityLabel="Add new address"
        >
          <Text style={[styles.addButton, { color: colors.primary }]}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddressCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderFormModal()}
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
    marginBottom: 8,
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeIcon: { fontSize: 18 },
  typeLabel: { fontSize: 15, fontWeight: '600' },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12 },
  actionText: { fontSize: 14, fontWeight: '600' },
  street: { fontSize: 15, marginBottom: 2 },
  cityLine: { fontSize: 13, marginBottom: 2 },
  country: { fontSize: 13, marginBottom: 8 },
  setDefaultButton: {
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  setDefaultText: { fontSize: 13, fontWeight: '600' },
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
  typeSelector: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  typeOptionIcon: { fontSize: 16 },
  typeOptionText: { fontSize: 13, fontWeight: '500' },
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
