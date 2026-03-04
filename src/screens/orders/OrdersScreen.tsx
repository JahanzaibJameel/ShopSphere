import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

export function OrdersScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        No orders yet
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
