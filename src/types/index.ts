export type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  director: string;
  plot: string;
  poster_url: string;
  created_at?: string;
  updated_at?: string;
};

export type Review = {
  id: number;
  movie_id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type RootStackParamList = {
  MovieList: undefined;
  MovieDetail: { movieId: number };
  ReviewList: { movieId: number };
  AddReview: { movieId: number; movieTitle: string };
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
};

// Add these navigation prop types
export type MovieListScreenProps = {
  navigation: any;
  route: any;
};

export type MovieDetailScreenProps = {
  navigation: any;
  route: any;
};

export type ReviewListScreenProps = {
  navigation: any;
  route: any;
};

export type AddReviewScreenProps = {
  navigation: any;
  route: any;
};