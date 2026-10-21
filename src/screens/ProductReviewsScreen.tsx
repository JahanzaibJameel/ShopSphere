import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { useAuth } from '@/store/AuthProvider';
import { Review } from '@/types';
import { StarRating } from '@/components/common/StarRating';

const { width } = Dimensions.get('window');

const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'u1',
    rating: 5,
    title: 'Excellent sound quality!',
    content: 'These headphones are amazing. The noise cancellation works perfectly and battery life is incredible.',
    images: [],
    helpful: 24,
    isVerified: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    productId: '1',
    userId: 'u2',
    rating: 4,
    title: 'Great but a bit pricey',
    content: 'Sound is fantastic, build quality is premium. Only downside is the price. Worth it if you can afford it.',
    images: [],
    helpful: 12,
    isVerified: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    productId: '1',
    userId: 'u3',
    rating: 3,
    title: 'Good but heavy',
    content: 'Sound quality is good but they are quite heavy for long sessions. Battery life is decent.',
    images: [],
    helpful: 5,
    isVerified: false,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ProductReviewsScreenProps {
  navigation: any;
  route: any;
}

export function ProductReviewsScreen({ navigation, route }: ProductReviewsScreenProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const productId = route?.params?.productId || '1';
  const productName = route?.params?.productName || 'Product';

  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleSubmitReview = () => {
    if (newRating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }
    if (!newTitle.trim()) {
      Alert.alert('Title Required', 'Please enter a review title.');
      return;
    }
    if (!newContent.trim()) {
      Alert.alert('Review Required', 'Please write your review.');
      return;
    }

    const newReview: Review = {
      id: `r-${Date.now()}`,
      productId,
      userId: user?.id || 'anonymous',
      rating: newRating,
      title: newTitle.trim(),
      content: newContent.trim(),
      images: [],
      helpful: 0,
      isVerified: !!user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setShowWriteModal(false);
    setNewRating(0);
    setNewTitle('');
    setNewContent('');
    Alert.alert('Thank You!', 'Your review has been submitted.');
  };

  const handleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      )
    );
  };

  const renderReviewCard = ({ item }: { item: Review }) => (
    <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {item.userId.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              User {item.userId.slice(-4)}
            </Text>
            {item.isVerified && (
              <Text style={[styles.verified, { color: colors.success }]}>
                ✓ Verified Purchase
              </Text>
            )}
          </View>
        </View>
        <StarRating rating={item.rating} size={14} />
      </View>

      <Text style={[styles.reviewTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.reviewContent, { color: colors.textSecondary }]}>
        {item.content}
      </Text>

      <View style={styles.reviewFooter}>
        <Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={[styles.helpfulButton, { borderColor: colors.border }]}
          onPress={() => handleHelpful(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Mark review as helpful, currently ${item.helpful} helpful votes`}
        >
          <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
            👍 Helpful ({item.helpful})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRatingSummary = () => (
    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.summaryLeft}>
        <Text style={[styles.averageRating, { color: colors.text }]}>
          {averageRating.toFixed(1)}
        </Text>
        <StarRating rating={averageRating} size={18} />
        <Text style={[styles.totalReviews, { color: colors.textSecondary }]}>
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </Text>
      </View>
      <View style={styles.summaryRight}>
        {ratingDistribution.map(({ star, count, percentage }) => (
          <View key={star} style={styles.distributionRow}>
            <Text style={[styles.starLabel, { color: colors.textSecondary }]}>{star}★</Text>
            <View style={[styles.barBackground, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.barFill,
                  { backgroundColor: colors.warning, width: `${percentage}%` },
                ]}
              />
            </View>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>{count}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSortBar = () => (
    <View style={styles.sortBar}>
      <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Sort by:</Text>
      {(['newest', 'highest', 'lowest', 'helpful'] as const).map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.sortOption,
            sortBy === option && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSortBy(option)}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${option}`}
          accessibilityState={{ selected: sortBy === option }}
        >
          <Text
            style={[
              styles.sortOptionText,
              { color: sortBy === option ? '#ffffff' : colors.textSecondary },
            ]}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderWriteModal = () => (
    <Modal
      visible={showWriteModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowWriteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Write a Review</Text>
            <TouchableOpacity
              onPress={() => setShowWriteModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Close review modal"
            >
              <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Your Rating</Text>
            <StarRating
              rating={newRating}
              interactive
              onRatingChange={setNewRating}
              size={32}
              showValue
            />

            <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 16 }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Summarize your experience"
              placeholderTextColor={colors.textTertiary}
              value={newTitle}
              onChangeText={setNewTitle}
              maxLength={100}
              accessibilityLabel="Review title input"
            />

            <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 16 }]}>Review</Text>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Share your thoughts about this product..."
              placeholderTextColor={colors.textTertiary}
              value={newContent}
              onChangeText={setNewContent}
              multiline
              numberOfLines={5}
              maxLength={1000}
              accessibilityLabel="Review content input"
            />

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmitReview}
              accessibilityRole="button"
              accessibilityLabel="Submit review"
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
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
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          Reviews: {productName}
        </Text>
        <TouchableOpacity
          onPress={() => setShowWriteModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Write a review"
        >
          <Text style={[styles.writeButton, { color: colors.primary }]}>Write</Text>
        </TouchableOpacity>
      </View>

      {renderRatingSummary()}
      {renderSortBar()}

      <FlatList
        data={sortedReviews}
        renderItem={renderReviewCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No reviews yet
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              Be the first to review this product!
            </Text>
          </View>
        }
      />

      {renderWriteModal()}
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
  title: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  writeButton: { fontSize: 16, fontWeight: '600' },
  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryLeft: { alignItems: 'center', marginRight: 24, justifyContent: 'center' },
  averageRating: { fontSize: 36, fontWeight: 'bold', marginBottom: 4 },
  totalReviews: { fontSize: 12, marginTop: 4 },
  summaryRight: { flex: 1, justifyContent: 'center' },
  distributionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  starLabel: { width: 24, fontSize: 12 },
  barBackground: { flex: 1, height: 8, borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  countLabel: { width: 24, fontSize: 12, textAlign: 'right' },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },
  sortLabel: { fontSize: 13, marginRight: 4 },
  sortOption: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sortOptionText: { fontSize: 12, fontWeight: '500' },
  listContent: { padding: 20, paddingTop: 8 },
  reviewCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '600' },
  verified: { fontSize: 11, marginTop: 2 },
  reviewTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  reviewContent: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewDate: { fontSize: 12 },
  helpfulButton: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  helpfulText: { fontSize: 12 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  emptyDescription: { fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
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
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
