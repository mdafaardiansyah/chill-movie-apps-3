import React, { useRef, useState, useEffect } from 'react';
import arrowLeftIcon from '../../assets/images/icons/arrow-left.png';
import arrowRightIcon from '../../assets/images/icons/arrow-right.png';
import heartIcon from '../../assets/images/icons/heart.png';
import heartFilledIcon from '../../assets/images/icons/heart-filled.png';
import watchLaterIcon from '../../assets/images/icons/clock.png';
import watchLaterFilledIcon from '../../assets/images/icons/clock-filled.png';
import ShareMovieModal from './ShareMovieModal';
import { favoritesStorage, watchlistStorage } from '../../services/storageService';

const MovieCarousel = ({ title, type = 'landscape', movies, onNotification }) => {
  const carouselRef = useRef(null);
  
  // State untuk menyimpan film yang disukai (IDs dari film yang disukai)
  const [likedMoviesIds, setLikedMoviesIds] = useState([]);
  
  // State untuk menyimpan film di watchlist
  const [watchlistMoviesIds, setWatchlistMoviesIds] = useState([]);
  
  // State untuk modal detail film
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // State untuk modal berbagi film
  const [showShareModal, setShowShareModal] = useState(false);

  // Muat status film favorit dan watchlist dari localStorage saat komponen dimuat
  useEffect(() => {
    // Dapatkan daftar film favorit dari localStorage
    const favorites = favoritesStorage.getFavorites();
    // Ekstrak IDs dari film favorit untuk pengecekan status
    const favoriteIds = favorites.map(movie => movie.id);
    setLikedMoviesIds(favoriteIds);
    
    // Dapatkan daftar film watchlist dari localStorage
    const watchlist = watchlistStorage.getWatchlist();
    // Ekstrak IDs dari watchlist untuk pengecekan status
    const watchlistIds = watchlist.map(movie => movie.id);
    setWatchlistMoviesIds(watchlistIds);
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      // Menghitung lebar item untuk scroll yang lebih akurat
      const scrollAmount = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      // Menghitung lebar item untuk scroll yang lebih akurat
      const scrollAmount = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Fungsi untuk mendapatkan URL gambar sesuai tipe carousel
  const getMoviePoster = (movie) => {
    // Safety check jika movie tidak ada
    if (!movie) return '';
    
    // Untuk tampilan di carousel
    if (type === 'landscape') {
      // Prioritaskan posterUrl untuk landscape (sesuai perubahan label di Admin)
      if (movie.posterUrl) return movie.posterUrl;
      
      // Jika ada poster dalam format objek, coba ambil landscape
      if (movie.poster && typeof movie.poster === 'object' && movie.poster.landscape) {
        return movie.poster.landscape;
      }
    } else {
      // Untuk tampilan portrait
      // Prioritaskan backdropUrl untuk portrait (sesuai perubahan label di Admin)
      if (movie.backdropUrl) return movie.backdropUrl;
      
      // Jika ada poster dalam format objek, coba ambil portrait
      if (movie.poster && typeof movie.poster === 'object' && movie.poster.portrait) {
        return movie.poster.portrait;
      }
    }
    
    // Fallback ke format lama jika format baru tidak tersedia
    
    // Jika poster adalah string URL langsung
    if (movie.poster && typeof movie.poster === 'string') {
      return movie.poster;
    }
    
    // Jika poster adalah objek, ambil yang tersedia
    if (movie.poster && typeof movie.poster === 'object') {
      return movie.poster.landscape || movie.poster.portrait || '';
    }
    
    // Fallback ke posterUrl atau backdropUrl yang tersedia
    return movie.posterUrl || movie.backdropUrl || '';
  };

  // Fungsi untuk menangani klik tombol like
  const handleLikeClick = (e, movie) => {
    e.stopPropagation();
    
    // Cek apakah film sudah disukai
    const isCurrentlyLiked = likedMoviesIds.includes(movie.id);
    
    if (isCurrentlyLiked) {
      // Jika sudah disukai, hapus dari daftar favorit
      const success = favoritesStorage.removeFavorite(movie.id);
      
      if (success) {
        // Perbarui state jika berhasil dihapus
        setLikedMoviesIds(prevIds => prevIds.filter(id => id !== movie.id));
        
        if (onNotification) {
          onNotification(`Film "${movie.title}" dihapus dari favorit`);
        }
      } else if (onNotification) {
        onNotification('Gagal menghapus film dari favorit', 'error');
      }
    } else {
      // Jika belum disukai, tambahkan ke daftar favorit
      const success = favoritesStorage.addFavorite(movie);
      
      if (success) {
        // Perbarui state jika berhasil ditambahkan
        setLikedMoviesIds(prevIds => [...prevIds, movie.id]);
        
        if (onNotification) {
          onNotification(`Film "${movie.title}" ditambahkan ke favorit`);
        }
      } else if (onNotification) {
        onNotification('Gagal menambahkan film ke favorit', 'error');
      }
    }
  };

  // Fungsi untuk menangani klik tombol tonton nanti (watchlist)
  const handleWatchLaterClick = (e, movie) => {
    e.stopPropagation();
    
    // Cek apakah film sudah ada di watchlist
    const isCurrentlyInWatchlist = watchlistMoviesIds.includes(movie.id);
    
    if (isCurrentlyInWatchlist) {
      // Jika sudah ada di watchlist, hapus dari watchlist
      const success = watchlistStorage.removeFromWatchlist(movie.id);
      
      if (success) {
        // Perbarui state jika berhasil dihapus
        setWatchlistMoviesIds(prevIds => prevIds.filter(id => id !== movie.id));
        
        if (onNotification) {
          onNotification(`Film "${movie.title}" dihapus dari daftar tonton nanti`);
        }
      } else if (onNotification) {
        onNotification('Gagal menghapus film dari daftar tonton nanti', 'error');
      }
    } else {
      // Jika belum ada di watchlist, tambahkan ke watchlist
      const success = watchlistStorage.addToWatchlist(movie);
      
      if (success) {
        // Perbarui state jika berhasil ditambahkan
        setWatchlistMoviesIds(prevIds => [...prevIds, movie.id]);
        
        if (onNotification) {
          onNotification(`Film "${movie.title}" ditambahkan ke daftar tonton nanti`);
        }
      } else if (onNotification) {
        onNotification('Gagal menambahkan film ke daftar tonton nanti', 'error');
      }
    }
  };

  return (
    <section className="carousel-section">
      <div className="container">
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
        </div>

        <div className="scroll-container" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <div className="scroll-arrow scroll-arrow-left" onClick={scrollLeft} style={{ position: 'absolute', left: '0', zIndex: 10, cursor: 'pointer', padding: '10px', backgroundColor: 'rgba(31, 29, 43, 0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', top: '50%', transform: 'translateY(-50%)' }}>
            <img src={arrowLeftIcon} alt="Scroll Left" style={{ width: '24px', height: '24px' }} />
          </div>

          <div className="movie-carousel" ref={carouselRef} style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', width: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .movie-carousel::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {movies.map((movie, index) => (
              <div key={index} className={`movie-card movie-card-${type}`} style={{ position: 'relative' }}>
                <div className="movie-poster" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => {
                  setSelectedMovie(movie);
                  setShowModal(true);
                }}>
                  <img src={getMoviePoster(movie)} alt={movie.title} />
                  {movie.info && type === 'landscape' && (
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      <div className="rating">
                        <span>★ {movie.rating}/5</span>
                      </div>
                    </div>
                  )}
                  {movie.badge && (
                    <span className={`badge badge-${movie.badge.type}`}>{movie.badge.text}</span>
                  )}
                  
                  <div className="movie-actions" style={{ 
                    position: 'absolute', 
                    bottom: '10px', 
                    right: '10px', 
                    display: 'flex', 
                    gap: '5px',
                    zIndex: 5
                  }}>
                    {/* Tombol Tonton Nanti */}
                    <button 
                      onClick={(e) => handleWatchLaterClick(e, movie)}
                      style={{ 
                        background: 'rgba(31, 29, 43, 0.7)', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        transform: watchlistMoviesIds.includes(movie.id) ? 'scale(1.1)' : 'scale(1)'
                      }}
                      title="Tonton Nanti"
                    >
                      <img 
                        src={watchlistMoviesIds.includes(movie.id) ? watchLaterFilledIcon : watchLaterIcon} 
                        alt="Tonton Nanti" 
                        style={{ width: '16px', height: '16px' }} 
                      />
                    </button>
                    
                    {/* Tombol Like */}
                    <button 
                      onClick={(e) => handleLikeClick(e, movie)}
                      style={{ 
                        background: 'rgba(31, 29, 43, 0.7)', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        transform: likedMoviesIds.includes(movie.id) ? 'scale(1.1)' : 'scale(1)'
                      }}
                      title="Favorit"
                    >
                      <img 
                        src={likedMoviesIds.includes(movie.id) ? heartFilledIcon : heartIcon} 
                        alt="Like" 
                        style={{ width: '16px', height: '16px' }} 
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-arrow scroll-arrow-right" onClick={scrollRight} style={{ position: 'absolute', right: '0', zIndex: 10, cursor: 'pointer', padding: '10px', backgroundColor: 'rgba(31, 29, 43, 0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', top: '50%', transform: 'translateY(-50%)' }}>
            <img src={arrowRightIcon} alt="Scroll Right" style={{ width: '24px', height: '24px' }} />
          </div>
        </div>
      </div>
      
      {/* Modal Detail Film */}
      {showModal && selectedMovie && (
        <div className="movie-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#1F1D2B',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
            padding: '20px'
          }}>
            <button 
              className="close-modal" 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            
            <div className="modal-header" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div className="modal-poster" style={{ flexShrink: 0, width: '150px' }}>
                <img 
                  src={getMoviePoster(selectedMovie)} 
                  alt={selectedMovie.title} 
                  style={{ width: '100%', borderRadius: '8px' }} 
                />
              </div>
              <div className="modal-info">
                <h2 style={{ marginBottom: '10px' }}>{selectedMovie.title}</h2>
                <div className="modal-rating" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#FFD700', marginRight: '5px' }}>★</span>
                  <span>{selectedMovie.rating}/5</span>
                </div>
                <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button 
                    className="btn-watch" 
                    style={{ 
                      backgroundColor: '#5142FC', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Tonton Sekarang
                  </button>
                  
                  {/* Tombol Tonton Nanti di Modal */}
                  <button 
                    className="btn-watchlater" 
                    onClick={() => handleWatchLaterClick(new Event('click'), selectedMovie)}
                    style={{ 
                      backgroundColor: watchlistMoviesIds.includes(selectedMovie.id) ? '#1E88E5' : '#3A3950', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <img 
                      src={watchlistMoviesIds.includes(selectedMovie.id) ? watchLaterFilledIcon : watchLaterIcon} 
                      alt="Tonton Nanti" 
                      style={{ width: '16px', height: '16px' }} 
                    />
                    {watchlistMoviesIds.includes(selectedMovie.id) ? 'Dalam Watchlist' : 'Tonton Nanti'}
                  </button>
                  
                  {/* Tombol Favorit di Modal */}
                  <button 
                    className="btn-like" 
                    onClick={() => handleLikeClick(new Event('click'), selectedMovie)}
                    style={{ 
                      backgroundColor: likedMoviesIds.includes(selectedMovie.id) ? '#E53935' : '#3A3950', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <img 
                      src={likedMoviesIds.includes(selectedMovie.id) ? heartFilledIcon : heartIcon} 
                      alt="Like" 
                      style={{ width: '16px', height: '16px' }} 
                    />
                    {likedMoviesIds.includes(selectedMovie.id) ? 'Disukai' : 'Suka'}
                  </button>
                  
                  <button 
                    className="btn-share" 
                    onClick={() => setShowShareModal(true)}
                    style={{ 
                      backgroundColor: '#3A3950', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: '4px', 
                      cursor: 'pointer'
                    }}
                  >
                    Bagikan
                  </button>
                </div>
              </div>
            </div>
            
            <div className="modal-description">
              <h3 style={{ marginBottom: '10px' }}>Deskripsi</h3>
              <p style={{ color: '#8E8E8E', lineHeight: '1.6' }}>
                {selectedMovie.overview || selectedMovie.description || 'Film ini adalah bagian dari koleksi film populer di Chill Movie Apps. Tonton sekarang untuk menikmati pengalaman menonton yang seru!'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Berbagi Film */}
      {showShareModal && selectedMovie && (
        <ShareMovieModal 
          movie={selectedMovie} 
          isOpen={showShareModal} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </section>
  );
};

export default MovieCarousel;