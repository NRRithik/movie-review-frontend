import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { addReview } from '../services/api';
import { AddReviewScreenProps } from '../types';

const AddReviewScreen: React.FC<AddReviewScreenProps> = ({ navigation, route }) => {
  const { movieId, movieTitle } = route.params as { movieId: number; movieTitle: string };
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        author_name: author.trim() || 'Anonymous',
        rating,
        comment: comment.trim(),
      };

      const response = await addReview(movieId, reviewData);
      
      if (response.data.success) {
        Alert.alert(
          'Success',
          'Review submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                navigation.navigate('ReviewList', { movieId });
              },
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Text style={[styles.starText, i <= rating && styles.selectedStar]}>★</Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.movieTitle}>{movieTitle}</Text>
          <Text style={styles.headerSubtitle}>Share your thoughts about this movie</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Your Name (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Anonymous"
            value={author}
            onChangeText={setAuthor}
            maxLength={50}
          />

          <Text style={styles.label}>Your Rating</Text>
          {renderRatingStars()}
          <Text style={styles.ratingText}>
            {rating > 0 ? `${rating} out of 5 stars` : 'Tap stars to rate'}
          </Text>

          <Text style={styles.label}>Your Review</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your review here..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{comment.length}/500 characters</Text>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d1d6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 150,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starButton: {
    padding: 5,
  },
  starText: {
    fontSize: 40,
    color: '#ccc',
  },
  selectedStar: {
    color: '#FFD700',
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#a7c7ff',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d1d6',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default AddReviewScreen;