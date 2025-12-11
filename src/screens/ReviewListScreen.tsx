import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
  RefreshControl,
} from 'react-native'; // Removed TouchableOpacity
import { getMovieReviews } from '../services/api';
import { Review, ReviewListScreenProps } from '../types';

const ReviewListScreen: React.FC<ReviewListScreenProps> = ({ navigation, route }) => {
  const { movieId } = route.params as { movieId: number };
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getMovieReviews(movieId);
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  const onRefresh = () => {
    setRefreshing(true);
    const fetchReviews = async () => {
      try {
        const response = await getMovieReviews(movieId);
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setRefreshing(false);
      }
    };
    fetchReviews();
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.starContainer}>
        <Text style={styles.ratingText}>{'★'.repeat(rating)}</Text>
      </View>
    );
  };

  const renderReviewItem: ListRenderItem<Review> = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.author}>{item.author_name || 'Anonymous'}</Text>
        {renderRatingStars(item.rating)}
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>★</Text>
          <Text style={styles.emptyText}>No reviews yet</Text>
          <Text style={styles.emptySubtext}>Be the first to review!</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 15,
  },
  reviewCard: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  starContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 18,
    color: '#FFD700',
  },
  comment: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 40,
    color: '#ccc',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ReviewListScreen;