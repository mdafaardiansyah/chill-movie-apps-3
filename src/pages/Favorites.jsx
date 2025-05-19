import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MovieList from '../components/home/MovieList';
import { useAuth } from '../contexts/AuthContext';
import { favoriteService } from '../hooks/useApi';
import { useCrud } from '../hooks/useApi';

const Favorites = () => {
  const { currentUser } = useAuth();
  
  // Menggunakan custom hook useCrud untuk mengelola operasi CRUD pada favorit
  const {
    items: favorites,
    loading,
    error,
    deleteItem: removeFavorite
  } = useCrud({
    getAll: favoriteService.getFavorites,
    delete: favoriteService.deleteFavorite
  });

  // Handler untuk menghapus film dari favorit
  const handleRemoveFavorite = async (movieId) => {
    try {
      await removeFavorite(movieId);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <div className="favorites-page">
      <Header />
      <main className="main-content">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Film Favorit Saya</h1>
          
          {!currentUser ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-lg">Silakan login untuk melihat film favorit Anda.</p>
            </div>
          ) : loading ? (
            <div className="loading-container text-center py-10">
              <p>Memuat film favorit...</p>
            </div>
          ) : error ? (
            <div className="error-container text-center py-10 text-red-500">
              <p>Error: {error}</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="empty-state text-center py-10">
              <p className="text-lg">Anda belum memiliki film favorit.</p>
            </div>
          ) : (
            <MovieList 
              movies={favorites} 
              onRemove={handleRemoveFavorite}
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

export default Favorites;