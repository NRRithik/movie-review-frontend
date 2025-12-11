// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { Movie, Review, ApiResponse } from '../types';

// USE YOUR IP ADDRESS
const API_BASE_URL = 'http://192.168.1.2:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Test connection function (silent - no console on success)
export const testConnection = async (): Promise<boolean> => {
  try {
    await axios.get('http://192.168.1.2:5000/health', { 
      timeout: 5000 
    });
    return true;
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ Cannot reach backend:', err.message);
    return false;
  }
};

// API Functions
export const getMovies = () => api.get<ApiResponse<Movie[]>>('/movies');
export const getMovieById = (id: number) => api.get<ApiResponse<Movie>>(`/movies/${id}`);
export const getMovieReviews = (id: number) => api.get<ApiResponse<Review[]>>(`/movies/${id}/reviews`);
export const addReview = (id: number, reviewData: Omit<Review, 'id' | 'movie_id' | 'created_at'>) => 
  api.post<ApiResponse<{ reviewId: number }>>(`/movies/${id}/reviews`, reviewData);

// Interceptors - ONLY LOG ERRORS
api.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => {
    console.error('❌ API Request Failed:', error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });
    
    return Promise.reject(error);
  }
);

export default api;