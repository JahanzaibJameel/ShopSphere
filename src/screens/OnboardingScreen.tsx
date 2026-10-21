import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Dimensions } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { useTheme } from '@/styles/ThemeProvider';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const storage = new MMKV({ id: 'onboarding-storage' });

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to ShopSphere',
    description: 'Discover amazing products from your favorite brands, all in one place.',
    emoji: '🛍️',
  },
  {
    id: '2',
    title: 'Smart Recommendations',
    description: 'Get personalized product recommendations based on your preferences and shopping history.',
    emoji: '🤖',
  },
  {
    id: '3',
    title: 'Secure Payments',
    description: 'Shop with confidence using our secure payment methods and biometric authentication.',
    emoji: '🔒',
  },
  {
    id: '4',
    title: 'Fast Delivery',
    description: 'Track your orders in real-time and enjoy fast, reliable delivery to your doorstep.',
    emoji: '🚚',
  },
];

const { width: screenWidth } = Dimensions.get('window');

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      // Use scrollToOffset instead of scrollToIndex for better web compatibility
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * screenWidth,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    storage.set('hasSeenOnboarding', true);
    onComplete();
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  const getItemLayout = (_data: any, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={[styles.slide, { width: screenWidth, backgroundColor: colors.background }]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {item.description}
      </Text>
    </View>
  );

  const renderDot = (index: number) => {
    const opacity = scrollX.interpolate({
      inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange: [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
      outputRange: [0.8, 1.2, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            opacity,
            transform: [{ scale }],
            backgroundColor: colors.primary,
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: colors.textSecondary }]}>
          Skip
        </Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        getItemLayout={getItemLayout}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        snapToInterval={screenWidth}
        snapToAlignment="start"
        decelerationRate="fast"
      />

      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => renderDot(index))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.nextText, { color: '#ffffff' }]}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
