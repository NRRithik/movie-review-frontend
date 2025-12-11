// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MovieListScreen from './src/screens/MovieListScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import ReviewListScreen from './src/screens/ReviewListScreen';
import AddReviewScreen from './src/screens/AddReviewScreen';

// Define navigation parameters
export type RootStackParamList = {
  MovieList: undefined;
  MovieDetail: { movieId: number };
  ReviewList: { movieId: number };
  AddReview: { movieId: number; movieTitle: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MovieList">
        <Stack.Screen 
          name="MovieList" 
          component={MovieListScreen} 
          options={{ title: 'Movies' }}
        />
        <Stack.Screen 
          name="MovieDetail" 
          component={MovieDetailScreen}
          options={{ title: 'Movie Details' }}
        />
        <Stack.Screen 
          name="ReviewList" 
          component={ReviewListScreen}
          options={{ title: 'Reviews' }}
        />
        <Stack.Screen 
          name="AddReview" 
          component={AddReviewScreen}
          options={{ title: 'Add Review' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
