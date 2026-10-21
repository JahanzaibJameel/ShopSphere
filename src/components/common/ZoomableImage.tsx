import React, { useRef, useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ZoomableImageProps {
  uri: string;
  alt?: string;
  width?: number;
  height?: number;
  minScale?: number;
  maxScale?: number;
}

export function ZoomableImage({
  uri,
  alt = 'Image',
  width = SCREEN_WIDTH,
  height = SCREEN_WIDTH,
  minScale = 1,
  maxScale = 4,
}: ZoomableImageProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Reset last values
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          // Pinch zoom
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          if (touch1 && touch2) {
            const dx = touch2.pageX - touch1.pageX;
            const dy = touch2.pageY - touch1.pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Simple scale based on distance change
            const newScale = Math.min(maxScale, Math.max(minScale, distance / 100));
            scale.setValue(newScale);
          }
        } else if (gestureState.numberActiveTouches === 1) {
          // Pan
          translateX.setValue(lastTranslateX.current + gestureState.dx);
          translateY.setValue(lastTranslateY.current + gestureState.dy);
        }
      },
      onPanResponderRelease: () => {
        // Snap back if scale < 1
        Animated.spring(scale, {
          toValue: Math.max(1, lastScale.current),
          useNativeDriver: true,
        }).start();
        if (lastScale.current <= 1) {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
          lastTranslateX.current = 0;
          lastTranslateY.current = 0;
        } else {
          lastTranslateX.current += 0;
          lastTranslateY.current += 0;
        }
      },
    })
  ).current;

  const handleDoubleTap = () => {
    const newScale = lastScale.current > 1 ? 1 : 2;
    lastScale.current = newScale;
    Animated.spring(scale, { toValue: newScale, useNativeDriver: true }).start();
    if (newScale === 1) {
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      lastTranslateX.current = 0;
      lastTranslateY.current = 0;
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.View
        style={[
          styles.imageWrapper,
          {
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri }}
          style={[styles.image, { width, height }]}
          resizeMode="contain"
          accessibilityLabel={alt}
        />
      </Animated.View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleDoubleTap}
        accessibilityRole="button"
        accessibilityLabel="Double tap to zoom"
      >
        <Text style={[styles.resetText, { color: colors.text }]}>Tap to zoom</Text>
      </TouchableOpacity>
    </View>
  );
}

// Simpler zoomable image gallery for product details
interface ImageGalleryZoomProps {
  images: string[];
  initialIndex?: number;
  width?: number;
  height?: number;
}

export function ImageGalleryZoom({
  images,
  initialIndex = 0,
  width = SCREEN_WIDTH,
  height = 300,
}: ImageGalleryZoomProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePinch = (evt: any) => {
    if (evt.nativeEvent.touches.length === 2) {
      const t1 = evt.nativeEvent.touches[0];
      const t2 = evt.nativeEvent.touches[1];
      const dx = t2.pageX - t1.pageX;
      const dy = t2.pageY - t1.pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const newScale = Math.min(3, Math.max(1, distance / 150));
      scale.setValue(newScale);
    }
  };

  const resetZoom = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={[styles.galleryContainer, { width, height }]}>
      <Animated.View
        style={{ transform: [{ scale }] }}
        onTouchMove={handlePinch}
        onTouchEnd={resetZoom}
      >
        <Image
          source={{ uri: images[currentIndex] || 'https://picsum.photos/400/400' }}
          style={{ width, height }}
          resizeMode="contain"
          accessibilityLabel={`Product image ${currentIndex + 1} of ${images.length}`}
        />
      </Animated.View>

      {images.length > 1 && (
        <View style={styles.indicators}>
          {images.map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentIndex ? colors.primary : colors.border },
              ]}
              onPress={() => {
                setCurrentIndex(i);
                resetZoom();
              }}
              accessibilityRole="button"
              accessibilityLabel={`View image ${i + 1}`}
            />
          ))}
        </View>
      )}

      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Pinch to zoom
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  imageWrapper: { justifyContent: 'center', alignItems: 'center' },
  image: {},
  resetButton: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  resetText: { fontSize: 11, color: '#ffffff' },
  galleryContainer: { justifyContent: 'center', alignItems: 'center', position: 'relative' },
  indicators: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  hint: { position: 'absolute', top: 8, right: 8, fontSize: 11 },
});
