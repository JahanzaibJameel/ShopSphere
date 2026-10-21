import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { Coupon } from '@/types';

const { width } = Dimensions.get('window');

interface CouponInputProps {
  onApply: (code: string) => Promise<Coupon | null>;
  onRemove?: () => void;
  appliedCoupon?: Coupon | null;
  disabled?: boolean;
}

export function CouponInput({
  onApply,
  onRemove,
  appliedCoupon,
  disabled = false,
}: CouponInputProps) {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const coupon = await onApply(code.trim().toUpperCase());
      if (coupon) {
        setCode('');
      } else {
        setError('Invalid or expired coupon code.');
      }
    } catch {
      setError('Failed to apply coupon. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code, onApply]);

  const handleRemove = useCallback(() => {
    if (onRemove) onRemove();
    setError(null);
  }, [onRemove]);

  if (appliedCoupon) {
    return (
      <View style={[styles.appliedContainer, { backgroundColor: colors.success + '10', borderColor: colors.success }]}>
        <View style={styles.appliedInfo}>
          <Text style={[styles.appliedLabel, { color: colors.success }]}>
            🎟️ Coupon Applied
          </Text>
          <Text style={[styles.appliedCode, { color: colors.text }]}>
            {appliedCoupon.code}
          </Text>
          <Text style={[styles.appliedDiscount, { color: colors.textSecondary }]}>
            {appliedCoupon.type === 'percentage'
              ? `${appliedCoupon.value}% off`
              : `$${appliedCoupon.value} off`}
            {appliedCoupon.minimumAmount
              ? ` (min. $${appliedCoupon.minimumAmount})`
              : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleRemove}
          style={styles.removeButton}
          accessibilityRole="button"
          accessibilityLabel="Remove coupon"
        >
          <Text style={[styles.removeText, { color: colors.error }]}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Promo Code</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border, color: colors.text },
          ]}
          placeholder="Enter coupon code"
          placeholderTextColor={colors.textTertiary}
          value={code}
          onChangeText={(v) => {
            setCode(v);
            if (error) setError(null);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!disabled && !isLoading}
          accessibilityLabel="Coupon code input"
        />
        <TouchableOpacity
          style={[
            styles.applyButton,
            { backgroundColor: code.trim() ? colors.primary : colors.border },
          ]}
          onPress={handleApply}
          disabled={disabled || isLoading || !code.trim()}
          accessibilityRole="button"
          accessibilityLabel="Apply coupon"
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.applyButtonText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
      <Text style={[styles.hint, { color: colors.textTertiary }]}>
        Try: SAVE10, WELCOME20, FREESHIP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  applyButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  errorText: { fontSize: 12, marginTop: 4 },
  hint: { fontSize: 11, marginTop: 4 },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  appliedInfo: { flex: 1 },
  appliedLabel: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  appliedCode: { fontSize: 15, fontWeight: 'bold' },
  appliedDiscount: { fontSize: 12, marginTop: 2 },
  removeButton: { padding: 8 },
  removeText: { fontSize: 16, fontWeight: 'bold' },
});
