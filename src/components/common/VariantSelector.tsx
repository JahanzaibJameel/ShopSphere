import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { ProductVariant, Product } from '@/types';

const { width } = Dimensions.get('window');

interface VariantSelectorProps {
  product: Product;
  onVariantChange?: (variant: ProductVariant | null) => void;
  selectedVariantId?: string;
}

export function VariantSelector({
  product,
  onVariantChange,
  selectedVariantId,
}: VariantSelectorProps) {
  const { colors } = useTheme();

  // Extract unique attribute keys from variants
  const attributeKeys = useMemo(() => {
    const keys = new Set<string>();
    product.variants.forEach((v) => {
      Object.keys(v.attributes).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [product.variants]);

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    if (selectedVariantId) {
      const v = product.variants.find((v) => v.id === selectedVariantId);
      return v ? { ...v.attributes } : {};
    }
    return product.variants.length > 0 ? { ...product.variants[0].attributes } : {};
  });

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find((v) =>
        Object.entries(selectedAttributes).every(
          ([key, value]) => v.attributes[key] === value
        )
      ) || null
    );
  }, [product.variants, selectedAttributes]);

  const handleAttributeSelect = (key: string, value: string) => {
    const newAttrs = { ...selectedAttributes, [key]: value };
    setSelectedAttributes(newAttrs);
    const variant = product.variants.find((v) =>
      Object.entries(newAttrs).every(([k, val]) => v.attributes[k] === val)
    );
    onVariantChange?.(variant || null);
  };

  const getAvailableValues = (key: string): string[] => {
    const values = new Set<string>();
    product.variants.forEach((v) => {
      if (v.attributes[key]) values.add(v.attributes[key]);
    });
    return Array.from(values);
  };

  const isValueAvailable = (key: string, value: string): boolean => {
    // Check if selecting this value would result in a valid variant
    const testAttrs = { ...selectedAttributes, [key]: value };
    return product.variants.some((v) =>
      Object.entries(testAttrs).every(([k, val]) => v.attributes[k] === val)
    );
  };

  const isColorAttribute = (key: string) =>
    key.toLowerCase().includes('color') || key.toLowerCase().includes('colour');

  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    black: '#000000',
    white: '#ffffff',
    yellow: '#f59e0b',
    pink: '#ec4899',
    purple: '#8b5cf6',
    orange: '#f97316',
    gray: '#6b7280',
    grey: '#6b7280',
    brown: '#92400e',
    navy: '#1e3a5f',
  };

  if (product.variants.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {attributeKeys.map((key) => {
        const values = getAvailableValues(key);
        const isColor = isColorAttribute(key);

        return (
          <View key={key} style={styles.attributeGroup}>
            <Text style={[styles.attributeLabel, { color: colors.text }]}>
              {key}: <Text style={{ color: colors.primary }}>{selectedAttributes[key] || 'Select'}</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsRow}>
                {values.map((value) => {
                  const isSelected = selectedAttributes[key] === value;
                  const isAvailable = isValueAvailable(key, value);

                  if (isColor) {
                    const colorValue = colorMap[value.toLowerCase()] || value;
                    return (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.colorOption,
                          { borderColor: isSelected ? colors.primary : colors.border },
                          !isAvailable && styles.disabledOption,
                        ]}
                        onPress={() => isAvailable && handleAttributeSelect(key, value)}
                        disabled={!isAvailable}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${key} ${value}`}
                        accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
                      >
                        <View
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: colorValue },
                            colorValue === '#ffffff' && { borderWidth: 1, borderColor: colors.border },
                          ]}
                        />
                        {isSelected && (
                          <View style={styles.colorCheck}>
                            <Text style={styles.checkmark}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.sizeOption,
                        { borderColor: colors.border, backgroundColor: colors.surface },
                        isSelected && {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        },
                        !isAvailable && styles.disabledOption,
                      ]}
                      onPress={() => isAvailable && handleAttributeSelect(key, value)}
                      disabled={!isAvailable}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${key} ${value}`}
                      accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          { color: isSelected ? '#ffffff' : colors.text },
                          !isAvailable && { color: colors.textTertiary },
                        ]}
                      >
                        {value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        );
      })}

      {selectedVariant && (
        <View style={[styles.variantInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.variantPrice, { color: colors.primary }]}>
            ${selectedVariant.price.current}
          </Text>
          {selectedVariant.price.original && (
            <Text style={[styles.variantOriginal, { color: colors.textSecondary }]}>
              ${selectedVariant.price.original}
            </Text>
          )}
          <Text
            style={[
              styles.stockStatus,
              { color: selectedVariant.inventory.isInStock ? colors.success : colors.error },
            ]}
          >
            {selectedVariant.inventory.isInStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  attributeGroup: { marginBottom: 16 },
  attributeLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  optionsRow: { flexDirection: 'row', gap: 8 },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorCheck: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 2 },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 4,
  },
  sizeText: { fontSize: 14, fontWeight: '500' },
  disabledOption: { opacity: 0.4 },
  variantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  variantPrice: { fontSize: 18, fontWeight: 'bold' },
  variantOriginal: { fontSize: 13, textDecorationLine: 'line-through' },
  stockStatus: { fontSize: 13, fontWeight: '600', marginLeft: 'auto' },
});
