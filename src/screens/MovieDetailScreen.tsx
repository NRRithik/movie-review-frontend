// src/screens/MovieDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getMovieById } from '../services/api';
import { Movie, MovieDetailScreenProps } from '../types';

const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({ navigation, route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await getMovieById(movieId);

        
        if (response.data.success) {
          setMovie(response.data.data);
        } else {
          console.log('MovieDetailScreen: Backend error message:', response.data.message);
          Alert.alert('Error', `Backend: ${response.data.message}`);
        }
      } catch (err: any) {
        console.error('MovieDetailScreen: API Call Failed:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        
        if (err.response) {
          Alert.alert(
            'Error', 
            `Status ${err.response.status}: ${err.response.data?.message || 'Movie not found'}`
          );
        } else if (err.request) {
          Alert.alert('Network Error', 'Could not connect to server. Is it running?');
        } else {
          Alert.alert('Error', 'Failed to load movie details');
        }
      } finally {
        setLoading(false);
        console.log('=== MovieDetailScreen: END ===');
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading movie #{movieId}...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Movie Not Found</Text>
        <Text style={styles.errorText}>ID: {movieId}</Text>
        <Text style={styles.errorHint}>
          Movie might not exist in database.
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back to Movies</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: movie.poster_url || 'https://via.placeholder.com/300x450' }}
        style={styles.poster}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.year}>{movie.year}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Genre:</Text>
          <Text style={styles.value}>{movie.genre}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Director:</Text>
          <Text style={styles.value}>{movie.director}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot</Text>
          <Text style={styles.plot}>{movie.plot}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.reviewButton]}
            onPress={() => {
              console.log('Navigating to ReviewList with movieId:', movieId);
              navigation.navigate('ReviewList', { movieId });
            }}
          >
            <Text style={styles.buttonText}>View Reviews</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => {
              console.log('Navigating to AddReview with movieId:', movieId, 'title:', movie.title);
              navigation.navigate('AddReview', { 
                movieId, 
                movieTitle: movie.title 
              });
            }}
          >
            <Text style={[styles.buttonText, styles.addButtonText]}>Add Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  errorHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  poster: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 5,
  },
  year: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    width: 80,
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  section: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 10,
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  reviewButton: {
    backgroundColor: '#34C759',
  },
  addButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#007AFF',
  },
});

export default MovieDetailScreen;
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { getMovieById } from '../services/api';
// import { Movie, MovieDetailScreenProps } from '../types';

// const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({ navigation, route }) => {
//   const { movieId } = route.params as { movieId: number };
//   const [movie, setMovie] = useState<Movie | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMovieDetails = async () => {
//       try {
//         const response = await getMovieById(movieId);
//         if (response.data.success) {
//           setMovie(response.data.data);
//         }
//       } catch (err) {
//         Alert.alert('Error', 'Failed to load movie details');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovieDetails();
//   }, [movieId]); // Add movieId to dependencies

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   if (!movie) {
//     return (
//       <View style={styles.centered}>
//         <Text>Movie not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <Image
//         source={{ uri: movie.poster_url || 'https://via.placeholder.com/300x450' }}
//         style={styles.poster}
//         resizeMode="cover"
//       />
      
//       <View style={styles.content}>
//         <Text style={styles.title}>{movie.title}</Text>
//         <Text style={styles.year}>{movie.year}</Text>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Genre:</Text>
//           <Text style={styles.value}>{movie.genre}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Director:</Text>
//           <Text style={styles.value}>{movie.director}</Text>
//         </View>
        
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Plot</Text>
//           <Text style={styles.plot}>{movie.plot}</Text>
//         </View>
        
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.button, styles.reviewButton]}
//             onPress={() => navigation.navigate('ReviewList', { movieId })}
//           >
//             <Text style={styles.buttonText}>View Reviews</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.button, styles.addButton]}
//             onPress={() => navigation.navigate('AddReview', { movieId, movieTitle: movie.title })}
//           >
//             <Text style={[styles.buttonText, styles.addButtonText]}>Add Review</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   poster: {
//     width: '100%',
//     height: 400,
//   },
//   content: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1c1c1e',
//     marginBottom: 5,
//   },
//   year: {
//     fontSize: 18,
//     color: '#007AFF',
//     fontWeight: '600',
//     marginBottom: 20,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1c1c1e',
//     width: 80,
//   },
//   value: {
//     fontSize: 16,
//     color: '#666',
//     flex: 1,
//   },
//   section: {
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1c1c1e',
//     marginBottom: 10,
//   },
//   plot: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#444',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   reviewButton: {
//     backgroundColor: '#34C759',
//   },
//   addButton: {
//     backgroundColor: 'white',
//     borderWidth: 2,
//     borderColor: '#007AFF',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   addButtonText: {
//     color: '#007AFF',
//   },
// });

// export default MovieDetailScreen;