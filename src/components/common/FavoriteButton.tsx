import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { useWishlist } from '@/store/WishlistProvider';
import { Product } from '@/types';

interface FavoriteButtonProps {
  product: Product;
  size?: number;
  style?: object;
  accessibilityLabel?: string;
}

export function FavoriteButton({
  product,
  size = 24,
  style,
  accessibilityLabel,
}: FavoriteButtonProps) {
  const { colors } = useTheme();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    toggleWishlist(product);
  }, [product, scaleAnim, toggleWishlist]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, style]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (isFavorite ? 'Remove from wishlist' : 'Add to wishlist')}
      accessibilityState={{ selected: isFavorite }}
    >
      <Animated.Text
        style={[
          styles.heart,
          { fontSize: size, transform: [{ scale: scaleAnim }] },
          { color: isFavorite ? '#ef4444' : colors.textTertiary },
        ]}
      >
        {isFavorite ? '❤️' : '🤍'}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  heart: {
    textAlign: 'center',
  },
});
