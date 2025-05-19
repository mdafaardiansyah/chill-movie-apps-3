import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService, favoriteService, watchlistService } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Menggunakan custom hook untuk mengambil data film
  const { 
    data: movie, 
    loading, 
    error 
  } = useApi(() => movieService.getMovieById(id), [id]);
  
  // State untuk status favorit dan watchlist
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Memeriksa status favorit dan watchlist
  useEffect(() => {
    const checkStatus = async () => {
      if (!currentUser || !movie) return;
      
      try {
        // Memeriksa apakah film ada di favorit
        const favorites = await favoriteService.getFavorites();
        const isMovieFavorite = favorites.some(fav => fav.movieId === id || fav.id === id);
        setIsFavorite(isMovieFavorite);
        
        // Memeriksa apakah film ada di watchlist
        const watchlist = await watchlistService.getWatchlist();
        const isMovieInWatchlist = watchlist.some(item => item.movieId === id || item.id === id);
        setIsInWatchlist(isMovieInWatchlist);
      } catch (err) {
        console.error('Error checking movie status:', err);
      }
    };
    
    checkStatus();
  }, [currentUser, movie, id]);
  
  // Handler untuk menambah/menghapus film dari favorit
  const handleToggleFavorite = async () => {
    if (!currentUser) {
      alert('Silakan login untuk menambahkan film ke favorit');
      navigate('/login');
      return;
    }
    
    setActionLoading(true);
    try {
      if (isFavorite) {
        // Cari ID favorit
        const favorites = await favoriteService.getFavorites();
        const favorite = favorites.find(fav => fav.movieId === id || fav.id === id);
        if (favorite) {
          await favoriteService.deleteFavorite(favorite.id);
        }
      } else {
        // Tambahkan ke favorit
        await favoriteService.addFavorite({
          ...movie,
          movieId: id
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Terjadi kesalahan saat memperbarui favorit');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handler untuk menambah/menghapus film dari watchlist
  const handleToggleWatchlist = async () => {
    if (!currentUser) {
      alert('Silakan login untuk menambahkan film ke watchlist');
      navigate('/login');
      return;
    }
    
    setActionLoading(true);
    try {
      if (isInWatchlist) {
        // Cari ID watchlist
        const watchlist = await watchlistService.getWatchlist();
        const watchlistItem = watchlist.find(item => item.movieId === id || item.id === id);
        if (watchlistItem) {
          await watchlistService.removeFromWatchlist(watchlistItem.id);
        }
      } else {
        // Tambahkan ke watchlist
        await watchlistService.addToWatchlist({
          ...movie,
          movieId: id
        });
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      alert('Terjadi kesalahan saat memperbarui watchlist');
    } finally {
      setActionLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <p>Memuat detail film...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="not-found-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <p>Film tidak ditemukan</p>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }
  
  return (
    <div className="movie-detail-container" style={{ padding: '30px' }}>
      <div className="movie-detail-content" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div className="movie-header" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h1 className="movie-title" style={{ fontSize: '2.5rem', margin: '0' }}>{movie.title}</h1>
          <div className="movie-meta" style={{ display: 'flex', gap: '15px', color: '#666' }}>
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.genre}</span>
            <span>•</span>
            <span>{movie.duration}</span>
          </div>
        </div>
        
        <div className="movie-content" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div className="movie-poster" style={{ flexBasis: '300px', flexShrink: 0 }}>
            {movie.poster ? (
              <img 
                src={movie.poster} 
                alt={movie.title} 
                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} 
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '450px', 
                backgroundColor: '#eee', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '8px'
              }}>
                <span>No Image</span>
              </div>
            )}
            
            <div className="movie-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={handleToggleFavorite}
                disabled={actionLoading}
                style={{ 
                  flex: 1,
                  padding: '10px',
                  backgroundColor: isFavorite ? '#e74c3c' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: actionLoading ? 0.7 : 1
                }}
              >
                {isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
              </button>
              
              <button 
                onClick={handleToggleWatchlist}
                disabled={actionLoading}
                style={{ 
                  flex: 1,
                  padding: '10px',
                  backgroundColor: isInWatchlist ? '#e74c3c' : '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: actionLoading ? 0.7 : 1
                }}
              >
                {isInWatchlist ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
              </button>
            </div>
          </div>
          
          <div className="movie-info" style={{ flex: 1, minWidth: '300px' }}>
            <div className="movie-rating" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '10px' }}>{movie.rating}/10</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(movie.rating / 2) ? '#f39c12' : '#ddd', fontSize: '1.5rem' }}>★</span>
                ))}
              </div>
            </div>
            
            <div className="movie-description" style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Sinopsis</h2>
              <p style={{ lineHeight: '1.6', color: '#333' }}>{movie.description || 'Tidak ada deskripsi tersedia untuk film ini.'}</p>
            </div>
            
            <div className="movie-details">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Detail</h2>
              
              <div className="detail-item" style={{ display: 'flex', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', width: '150px' }}>Sutradara:</span>
                <span>{movie.director || '-'}</span>
              </div>
              
              <div className="detail-item" style={{ display: 'flex', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', width: '150px' }}>Penulis:</span>
                <span>{movie.writer || '-'}</span>
              </div>
              
              <div className="detail-item" style={{ display: 'flex', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', width: '150px' }}>Pemain:</span>
                <span>{movie.actors || '-'}</span>
              </div>
              
              <div className="detail-item" style={{ display: 'flex', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', width: '150px' }}>Bahasa:</span>
                <span>{movie.language || '-'}</span>
              </div>
              
              <div className="detail-item" style={{ display: 'flex', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', width: '150px' }}>Negara:</span>
                <span>{movie.country || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;