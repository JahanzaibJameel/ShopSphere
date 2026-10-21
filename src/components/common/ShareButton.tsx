import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { Product } from '@/types';

const { width } = Dimensions.get('window');

interface ShareButtonProps {
  product: Product;
  variant?: 'icon' | 'button' | 'full';
  size?: number;
}

export function ShareButton({ product, variant = 'icon', size = 24 }: ShareButtonProps) {
  const { colors } = useTheme();

  const handleShare = async () => {
    const productUrl = `https://shopsphere.app/product/${product.id}`;
    const message = `Check out ${product.name} on ShopSphere! ${productUrl}`;

    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: product.name,
            text: product.shortDescription || product.description,
            url: productUrl,
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(productUrl);
          Alert.alert('Copied', 'Product link copied to clipboard!');
        }
      } else {
        const result = await Share.share(
          {
            title: product.name,
            message,
            url: productUrl,
          },
          {
            dialogTitle: `Share ${product.name}`,
            subject: product.name,
          }
        );

        if (result.action === Share.sharedAction) {
          // Shared successfully
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share product.');
      }
    }
  };

  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={handleShare}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel={`Share ${product.name}`}
      >
        <Text style={{ fontSize: size }}>📤</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'button') {
    return (
      <TouchableOpacity
        onPress={handleShare}
        style={[styles.button, { borderColor: colors.border }]}
        accessibilityRole="button"
        accessibilityLabel={`Share ${product.name}`}
      >
        <Text style={styles.buttonIcon}>📤</Text>
        <Text style={[styles.buttonText, { color: colors.text }]}>Share</Text>
      </TouchableOpacity>
    );
  }

  // Full variant with social platforms
  return (
    <View style={styles.fullContainer}>
      <Text style={[styles.fullTitle, { color: colors.text }]}>Share this product</Text>
      <View style={styles.platformsRow}>
        {[
          { name: 'WhatsApp', icon: '💬', color: '#25D366' },
          { name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
          { name: 'Facebook', icon: '📘', color: '#1877F2' },
          { name: 'Instagram', icon: '📸', color: '#E4405F' },
          { name: 'Copy Link', icon: '🔗', color: colors.primary },
        ].map((platform) => (
          <TouchableOpacity
            key={platform.name}
            style={[styles.platformButton, { backgroundColor: platform.color + '15' }]}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel={`Share via ${platform.name}`}
          >
            <Text style={styles.platformIcon}>{platform.icon}</Text>
            <Text style={[styles.platformName, { color: colors.text }]}>{platform.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonIcon: { fontSize: 16 },
  buttonText: { fontSize: 14, fontWeight: '500' },
  fullContainer: { padding: 16 },
  fullTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  platformsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  platformButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
  },
  platformIcon: { fontSize: 24, marginBottom: 4 },
  platformName: { fontSize: 11, fontWeight: '500' },
});
