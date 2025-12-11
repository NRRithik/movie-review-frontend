# 🎬 Movie Review Mobile App

React Native mobile app with Express.js backend for browsing movies and writing reviews.

## 📱 Features
- Browse movie list with posters
- View movie details (plot, director, genre)
- Read existing reviews
- Submit new reviews with star ratings

## 🏗️ Tech Stack
- **Frontend**: React Native (Expo) + TypeScript
- **Navigation**: React Navigation Stack
- **Backend**: Express.js + MySQL
- **API Client**: Axios

## 📁 Project Structure



movie-review-frontend/ (This repo)
├── src/screens/ # 4 app screens
├── src/services/api.ts # API configuration
├── App.tsx # Main navigation
└── app.json

movie-review-backend/ (Separate repo)
├── controllers/ # API logic
├── routes/ # Endpoints
└── server.js




**Backend Repo:** `https://github.com/NRRithik/movie-review-backend`

## 🚀 Quick Setup

### 1. Database Setup
```sql
CREATE DATABASE movie_review_app;
USE movie_review_app;

CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    year INT,
    genre VARCHAR(100),
    director VARCHAR(255),
    plot TEXT,
    poster_url VARCHAR(500)
);

CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT,
    author_name VARCHAR(100) DEFAULT 'Anonymous',
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);



Backend Setup
bash
cd movie-review-backend
npm install
# Create .env with DB credentials
npm run dev



Frontend Setup
bash
cd movie-review-frontend
npm install
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/stack axios


Update IP in src/services/api.ts:
const API_BASE_URL = 'http://YOUR_IP:5000/api'; // Your computer's IP



API Endpoints
Method	Endpoint	Description
GET	/api/movies	Get all movies
GET	/api/movies/:id	Get movie details
GET	/api/movies/:id/reviews	Get movie reviews
POST	/api/movies/:id/reviews	Add new review


Run Mobile App
bash
npx expo start

Scan QR with Expo Go app (physical device)
Press 'a' for Android emulator
Press 'i' for iOS simulator

Troubleshooting
Network Error: Update IP in api.ts
Backend Not Running: npm run dev in backend folder
MySQL Issues: Check .env credentials


