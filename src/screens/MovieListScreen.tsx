// src/screens/MovieListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ListRenderItem,
  TextInput,
  RefreshControl,
} from 'react-native';
import { getMovies } from '../services/api';
import { Movie, MovieListScreenProps } from '../types';

const MovieListScreen: React.FC<MovieListScreenProps> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Extract unique genres
  const allGenres = Array.from(
    new Set(movies.flatMap(movie => 
      movie.genre.split(',').map(g => g.trim())
    ))
  );

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, searchQuery, selectedGenre, sortBy]);

  const fetchMovies = async () => {
    try {
      const response = await getMovies();
      if (response.data.success) {
        setMovies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAndSortMovies = () => {
    let filtered = [...movies];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.year - a.year;
        case 'oldest':
          return a.year - b.year;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return b.year - a.year;
      }
    });

    setFilteredMovies(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies();
  };

  const renderMovieItem: ListRenderItem<Movie> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.poster_url || 'https://via.placeholder.com/100x150?text=No+Poster' }}
          style={styles.poster}
          resizeMode="cover"
        />
        
        <View style={styles.movieInfo}>
          <View style={styles.movieHeader}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>{item.year}</Text>
            </View>
          </View>
          
          <Text style={styles.director} numberOfLines={1}>
            👤 {item.director}
          </Text>
          
          <View style={styles.genreContainer}>
            {item.genre.split(',').slice(0, 2).map((genre, idx) => (
              <View key={idx} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.trim()}</Text>
              </View>
            ))}
            {item.genre.split(',').length > 2 && (
              <Text style={styles.moreGenres}>+{item.genre.split(',').length - 2} more</Text>
            )}
          </View>
          
          <Text style={styles.plot} numberOfLines={2}>
            {item.plot || 'No description available'}
          </Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate('ReviewList', { movieId: item.id })}
            >
              <Text style={styles.reviewButtonText}>Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Movie Collection</Text>
        <Text style={styles.headerSubtitle}>Browse {movies.length} movies</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, directors, genres..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{color: '#999', fontSize: 18}}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Genre Filters - HORIZONTAL SCROLL */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>Genres</Text>
        <FlatList
          horizontal
          data={['All Movies', ...allGenres]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.genreChip, 
                (item === 'All Movies' && !selectedGenre) || selectedGenre === item 
                  ? styles.genreChipActive 
                  : null
              ]}
              onPress={() => {
                if (item === 'All Movies') {
                  setSelectedGenre(null);
                } else {
                  setSelectedGenre(selectedGenre === item ? null : item);
                }
              }}
            >
              <Text style={[
                styles.genreChipText,
                (item === 'All Movies' && !selectedGenre) || selectedGenre === item 
                  ? styles.genreChipTextActive 
                  : null
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'newest' && styles.sortButtonActive]}
            onPress={() => setSortBy('newest')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'newest' && styles.sortButtonTextActive]}>
              Newest
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'oldest' && styles.sortButtonActive]}
            onPress={() => setSortBy('oldest')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'oldest' && styles.sortButtonTextActive]}>
              Oldest
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
            onPress={() => setSortBy('title')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>
              Title A-Z
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Count - FIXED POSITION */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
          {selectedGenre && ` in ${selectedGenre}`}
          {searchQuery && ` for "${searchQuery}"`}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{fontSize: 80, color: '#ccc', marginBottom: 10}}>🎬</Text>
            <Text style={styles.emptyTitle}>No movies found</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : 'Try adjusting your filters'}
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedGenre(null);
                setSortBy('newest');
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 18,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersSection: {
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 10,
  },
  genreList: {
    paddingRight: 15,
  },
  genreChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  genreChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genreChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genreChipTextActive: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortButtonActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  resultsContainer: {
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  list: {
    paddingBottom: 20,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginRight: 10,
  },
  yearBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  yearText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  director: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    alignItems: 'center',
  },
  genreTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  moreGenres: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  plot: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  reviewButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  resetButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default MovieListScreen;
