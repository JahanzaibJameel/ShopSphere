import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  accessibilityLabel?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
  showValue = false,
  accessibilityLabel,
}: StarRatingProps) {
  const { colors } = useTheme();
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const handlePress = useCallback(
    (star: number) => {
      if (interactive && onRatingChange) {
        onRatingChange(star);
      }
    },
    [interactive, onRatingChange]
  );

  return (
    <View
      style={styles.container}
      accessibilityRole={interactive ? 'adjustable' : 'text'}
      accessibilityLabel={accessibilityLabel || `Rating: ${rating} out of ${maxRating}`}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.floor(displayRating);
        const isHalf = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <TouchableOpacity
            key={starValue}
            onPress={() => handlePress(starValue)}
            disabled={!interactive}
            activeOpacity={interactive ? 0.7 : 1}
            style={styles.starButton}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            accessibilityState={{ selected: starValue <= displayRating }}
          >
            <Text style={[styles.star, { fontSize: size }]}>
              {isFilled ? '★' : isHalf ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
      {showValue && (
        <Text style={[styles.value, { color: colors.textSecondary, fontSize: size * 0.7 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    color: '#f59e0b',
  },
  value: {
    marginLeft: 6,
    fontWeight: '600',
  },
});
