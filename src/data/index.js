// File ini berfungsi sebagai titik masuk utama untuk semua data
// Mengekspor semua data dari file-file terpisah

import { continueWatchingMovies, topRatingMovies, trendingMovies } from './movies';
import { favoriteMovies } from './favorites';
import { watchlistMovies } from './watchlist';
import { MOVIE_STATUS, BADGE_TYPES, VIEW_TYPES, MOVIE_GENRES } from './constants';

export {
  // Data film
  continueWatchingMovies,
  topRatingMovies,
  trendingMovies,
  favoriteMovies,
  watchlistMovies,
  
  // Konstanta
  MOVIE_STATUS,
  BADGE_TYPES,
  VIEW_TYPES,
  MOVIE_GENRES
};