import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MovieList from '../components/home/MovieList';
import { useAuth } from '../contexts/AuthContext';
import { watchlistService } from '../hooks/useApi';
import { useCrud } from '../hooks/useApi';

const Watchlist = () => {
  const { currentUser } = useAuth();
  
  // Menggunakan custom hook useCrud untuk mengelola operasi CRUD pada watchlist
  const {
    items: watchlistItems,
    loading,
    error,
    deleteItem: removeFromWatchlist
  } = useCrud({
    getAll: watchlistService.getWatchlist,
    delete: watchlistService.removeFromWatchlist
  });

  // Handler untuk menghapus film dari watchlist
  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  return (
    <div className="watchlist-page">
      <Header />
      <main className="main-content">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Watchlist Saya</h1>
          
          {!currentUser ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-lg">Silakan login untuk melihat watchlist Anda.</p>
            </div>
          ) : loading ? (
            <div className="loading-container text-center py-10">
              <p>Memuat watchlist...</p>
            </div>
          ) : error ? (
            <div className="error-container text-center py-10 text-red-500">
              <p>Error: {error}</p>
            </div>
          ) : watchlistItems.length === 0 ? (
            <div className="empty-state text-center py-10">
              <p className="text-lg">Anda belum memiliki film dalam watchlist.</p>
            </div>
          ) : (
            <MovieList 
              movies={watchlistItems} 
              onRemove={handleRemoveFromWatchlist}
              type="grid"
              showRemoveButton
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Watchlist;