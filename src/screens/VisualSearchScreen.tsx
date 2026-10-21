import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { Product } from '@/types';
import { Skeleton } from '@/components/common/Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VisualSearchScreenProps {
  navigation: any;
}

type SearchState = 'idle' | 'captured' | 'analyzing' | 'results' | 'error';

const mockSimilarProducts: Product[] = [
  {
    id: 'vs-1', name: 'Wireless Headphones Pro', description: 'Premium noise-cancelling', shortDescription: '', sku: 'WH001',
    brand: { id: '1', name: 'AudioTech' }, categories: [],
    price: { current: 299.99, original: 399.99, currency: 'USD' },
    images: [{ id: '1', url: 'https://picsum.photos/seed/hp1/200/200', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 50, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.5, count: 128, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'vs-2', name: 'Noise Cancelling Headset', description: 'Advanced ANC', shortDescription: '', sku: 'WH002',
    brand: { id: '2', name: 'SoundMax' }, categories: [],
    price: { current: 249.99, currency: 'USD' },
    images: [{ id: '2', url: 'https://picsum.photos/seed/hp2/200/200', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 30, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.3, count: 89, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'vs-3', name: 'Studio Monitor Headphones', description: 'Professional grade', shortDescription: '', sku: 'WH003',
    brand: { id: '3', name: 'AudioPro' }, categories: [],
    price: { current: 189.99, original: 229.99, currency: 'USD' },
    images: [{ id: '3', url: 'https://picsum.photos/seed/hp3/200/200', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 20, lowStockThreshold: 5, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.7, count: 256, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'vs-4', name: 'Bass Boost Headphones', description: 'Deep bass sound', shortDescription: '', sku: 'WH004',
    brand: { id: '4', name: 'BassTech' }, categories: [],
    price: { current: 149.99, currency: 'USD' },
    images: [{ id: '4', url: 'https://picsum.photos/seed/hp4/200/200', alt: '', order: 1, type: 'main' }],
    variants: [], attributes: [],
    inventory: { quantity: 45, lowStockThreshold: 10, trackQuantity: true, allowBackorder: false, isInStock: true, reserved: 0 },
    ratings: { average: 4.1, count: 67, distribution: {} },
    seo: { title: '', description: '', keywords: [] }, tags: [], isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export function VisualSearchScreen({ navigation }: VisualSearchScreenProps) {
  const { colors } = useTheme();
  const [state, setState] = useState<SearchState>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleCapture = useCallback(() => {
    setCapturedImage('https://picsum.photos/seed/captured/300/300');
    setState('captured');

    // Auto-analyze after capture
    setTimeout(() => {
      setState('analyzing');
      setTimeout(() => {
        setResults(mockSimilarProducts);
        setState('results');
        animateIn();
      }, 1800);
    }, 500);
  }, [animateIn]);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setResults([]);
    setErrorMessage('');
    setState('idle');
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
  }, [fadeAnim, scaleAnim]);

  const handleRetry = useCallback(() => {
    setErrorMessage('');
    setState('captured');
    setTimeout(() => {
      setState('analyzing');
      setTimeout(() => {
        setResults(mockSimilarProducts);
        setState('results');
        animateIn();
      }, 1800);
    }, 500);
  }, [animateIn]);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  }, [navigation]);

  const renderIdle = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.heroCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary }]}>
        <Text style={styles.heroEmoji}>📸</Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Visual Search
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
          Snap a photo of any product and instantly find it or similar items in our catalog
        </Text>
      </View>

      <View style={styles.captureOptions}>
        <TouchableOpacity
          style={[styles.captureButton, { backgroundColor: colors.primary }]}
          onPress={handleCapture}
          accessibilityRole="button"
          accessibilityLabel="Capture photo with camera"
        >
          <Text style={styles.captureIcon}>📷</Text>
          <Text style={styles.captureText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.galleryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleCapture}
          accessibilityRole="button"
          accessibilityLabel="Choose photo from gallery"
        >
          <Text style={styles.galleryIcon}>🖼️</Text>
          <Text style={[styles.galleryText, { color: colors.text }]}>From Gallery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={[styles.featuresTitle, { color: colors.text }]}>How it works</Text>
        {[
          { icon: '1️⃣', title: 'Capture', desc: 'Take a photo or upload from gallery' },
          { icon: '2️⃣', title: 'Analyze', desc: 'AI extracts visual features instantly' },
          { icon: '3️⃣', title: 'Match', desc: 'Get ranked similar products' },
          { icon: '4️⃣', title: 'Shop', desc: 'Tap to view details and purchase' },
        ].map((step, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{step.icon}</Text>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{step.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tips}>
        <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Pro Tips</Text>
        {[
          'Good lighting improves accuracy',
          'Capture the full product in frame',
          'Avoid glare and reflections',
          'Try multiple angles for best results',
        ].map((tip, i) => (
          <Text key={i} style={[styles.tip, { color: colors.textSecondary }]}>
            • {tip}
          </Text>
        ))}
      </View>
    </ScrollView>
  );

  const renderCaptured = () => (
    <View style={styles.capturedContainer}>
      <View style={[styles.imageFrame, { borderColor: colors.primary }]}>
        <Image source={{ uri: capturedImage! }} style={styles.capturedImage} />
        <View style={styles.imageOverlay}>
          <Text style={styles.imageOverlayText}>✓ Captured</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.analyzeButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          setState('analyzing');
          setTimeout(() => {
            setResults(mockSimilarProducts);
            setState('results');
            animateIn();
          }, 2000);
        }}
        accessibilityRole="button"
        accessibilityLabel="Analyze captured image"
      >
        <Text style={styles.analyzeButtonText}>🔍 Analyze Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cancelButton, { borderColor: colors.border }]}
        onPress={handleReset}
        accessibilityRole="button"
        accessibilityLabel="Cancel and retake"
      >
        <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAnalyzing = () => (
    <View style={styles.analyzingContainer}>
      <Image source={{ uri: capturedImage! }} style={styles.analyzingImage} />
      <View style={styles.analyzingOverlay}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.analyzingText, { color: colors.text }]}>Analyzing...</Text>
        <Text style={[styles.analyzingSubtext, { color: colors.textSecondary }]}>
          Extracting visual features
        </Text>
        <View style={styles.progressSteps}>
          {['Detecting objects', 'Extracting features', 'Matching catalog', 'Ranking results'].map((step, i) => (
            <View key={i} style={styles.progressStep}>
              <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderResults = () => (
    <Animated.ScrollView
      style={[styles.resultsContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.resultsHeader}>
        <Image source={{ uri: capturedImage! }} style={styles.resultThumb} />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultTitle, { color: colors.text }]}>
            {results.length} matches found
          </Text>
          <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>
            Sorted by visual similarity
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.newSearchButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel="New search"
        >
          <Text style={[styles.newSearchText, { color: colors.primary }]}>New</Text>
        </TouchableOpacity>
      </View>

      {results.map((product, index) => (
        <TouchableOpacity
          key={product.id}
          style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => handleProductPress(product)}
          accessibilityRole="button"
          accessibilityLabel={`${product.name}, ${95 - index * 7}% match, $${product.price.current}`}
        >
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{95 - index * 7}%</Text>
          </View>
          <View style={styles.resultImage}>
            <Text style={styles.resultImagePlaceholder}>📦</Text>
          </View>
          <View style={styles.resultDetails}>
            <Text style={[styles.resultProductName, { color: colors.text }]} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={[styles.resultBrand, { color: colors.textSecondary }]}>
              {product.brand.name}
            </Text>
            <View style={styles.resultPriceRow}>
              <Text style={[styles.resultPrice, { color: colors.primary }]}>
                ${product.price.current}
              </Text>
              {product.price.original && (
                <Text style={[styles.resultOriginal, { color: colors.textSecondary }]}>
                  ${product.price.original}
                </Text>
              )}
            </View>
            <View style={styles.resultMeta}>
              <Text style={styles.resultRating}>⭐ {product.ratings.average}</Text>
              <Text style={[styles.resultReviews, { color: colors.textSecondary }]}>
                ({product.ratings.count})
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.wishlistButton}
            accessibilityRole="button"
            accessibilityLabel="Add to wishlist"
          >
            <Text style={styles.wishlistIcon}>🤍</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.shopTheLookButton, { backgroundColor: colors.secondary }]}
        accessibilityRole="button"
        accessibilityLabel="Shop the complete look"
      >
        <Text style={styles.shopTheLookText}>🛍️ Shop the Complete Look</Text>
        <Text style={styles.shopTheLookSubtext}>Get all matched items together</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tryAgainButton, { borderColor: colors.border }]}
        onPress={handleReset}
        accessibilityRole="button"
        accessibilityLabel="Search another product"
      >
        <Text style={[styles.tryAgainText, { color: colors.text }]}>Search Another Product</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={[styles.errorTitle, { color: colors.text }]}>Search Failed</Text>
      <Text style={[styles.errorDescription, { color: colors.textSecondary }]}>
        {errorMessage || 'Could not analyze the image. Please try again with a clearer photo.'}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={handleRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry search"
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={[styles.title, { color: colors.text }]}>Visual Search</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Help"
        >
          <Text style={[styles.helpButton, { color: colors.primary }]}>?</Text>
        </TouchableOpacity>
      </View>

      {state === 'idle' && renderIdle()}
      {state === 'captured' && renderCaptured()}
      {state === 'analyzing' && renderAnalyzing()}
      {state === 'results' && renderResults()}
      {state === 'error' && renderError()}
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
  title: { fontSize: 20, fontWeight: 'bold' },
  helpButton: { fontSize: 18, fontWeight: 'bold', width: 32, textAlign: 'center' },
  content: { flex: 1, padding: 20 },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  captureOptions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  captureButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  captureIcon: { fontSize: 28 },
  captureText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  galleryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 4,
  },
  galleryIcon: { fontSize: 28 },
  galleryText: { fontSize: 14, fontWeight: '600' },
  features: { marginBottom: 24 },
  featuresTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  featureIcon: { fontSize: 24 },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600' },
  featureDesc: { fontSize: 12, marginTop: 2 },
  tips: { marginBottom: 20 },
  tipsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tip: { fontSize: 13, lineHeight: 20, marginBottom: 2 },
  capturedContainer: { flex: 1, padding: 20, alignItems: 'center' },
  imageFrame: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  capturedImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  imageOverlayText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  analyzeButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  analyzeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  cancelButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: { fontSize: 14, fontWeight: '600' },
  analyzingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  analyzingImage: { width: 180, height: 180, borderRadius: 16, marginBottom: 24, opacity: 0.7 },
  analyzingOverlay: { alignItems: 'center' },
  analyzingText: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  analyzingSubtext: { fontSize: 13, marginTop: 4, marginBottom: 20 },
  progressSteps: { width: '100%', gap: 8 },
  progressStep: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressDot: { width: 8, height: 8, borderRadius: 4 },
  progressText: { fontSize: 13 },
  resultsContainer: { flex: 1, padding: 20 },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  resultThumb: { width: 50, height: 50, borderRadius: 8 },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 16, fontWeight: 'bold' },
  resultSubtitle: { fontSize: 13, marginTop: 2 },
  newSearchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  newSearchText: { fontSize: 13, fontWeight: '600' },
  resultCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  resultImage: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  resultImagePlaceholder: { fontSize: 32 },
  resultDetails: { flex: 1 },
  resultProductName: { fontSize: 14, fontWeight: '600', marginBottom: 2, paddingRight: 50 },
  resultBrand: { fontSize: 12, marginBottom: 4 },
  resultPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  resultPrice: { fontSize: 16, fontWeight: 'bold' },
  resultOriginal: { fontSize: 12, textDecorationLine: 'line-through' },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultRating: { fontSize: 12 },
  resultReviews: { fontSize: 12 },
  wishlistButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistIcon: { fontSize: 18 },
  shopTheLookButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  shopTheLookText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  shopTheLookSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  tryAgainButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  tryAgainText: { fontSize: 14, fontWeight: '600' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  errorDescription: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
