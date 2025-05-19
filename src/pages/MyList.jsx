import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MovieList from '../components/home/MovieList';
import WatchlistManager from '../components/home/WatchlistManager';
import { favoritesStorage, watchlistStorage } from '../services/storageService';

// Komponen film untuk menampilkan film di MyList
const MovieCard = ({ movie, onRemove, type = 'grid' }) => {
  // Mendapatkan poster yang sesuai
  const getPosterUrl = () => {
    if (!movie.poster) return '';
    
    // Jika poster adalah string
    if (typeof movie.poster === 'string') {
      return movie.poster;
    }
    
    // Jika poster adalah objek dengan properti landscape dan portrait
    if (typeof movie.poster === 'object') {
      return movie.poster.portrait || movie.poster.landscape || '';
    }
    
    return '';
  };

  return (
    <div className="movie-card" style={{ 
      position: 'relative',
      margin: '15px',
      width: type === 'grid' ? '200px' : '100%',
      transition: 'transform 0.3s ease',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#272634',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      <div className="movie-poster" style={{ position: 'relative' }}>
        <img 
          src={getPosterUrl()} 
          alt={movie.title}
          style={{ 
            width: '100%', 
            aspectRatio: type === 'grid' ? '2/3' : '16/9',
            objectFit: 'cover',
            borderRadius: '8px 8px 0 0'
          }}
        />
      </div>
      
      <div className="movie-info" style={{ padding: '12px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0',
          fontSize: '16px',
          color: 'white',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>{movie.title}</h3>
        
        {movie.rating && (
          <div className="rating" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#FFD700', marginRight: '5px' }}>★</span>
            <span style={{ color: '#ccc' }}>{movie.rating}/5</span>
          </div>
        )}
        
        {movie.addedAt && (
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
            Ditambahkan pada: {new Date(movie.addedAt).toLocaleDateString()}
          </div>
        )}
        
        <button 
          onClick={() => onRemove(movie.id)}
          style={{ 
            width: '100%',
            padding: '8px',
            backgroundColor: '#e53935',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '8px'
          }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

// Komponen untuk item watchlist
const WatchlistItem = ({ movie, onRemove, onMarkWatched }) => {
  const [expanded, setExpanded] = useState(false);

  // Mendapatkan poster yang sesuai
  const getPosterUrl = () => {
    if (!movie.poster) return '';
    if (typeof movie.poster === 'string') return movie.poster;
    if (typeof movie.poster === 'object') return movie.poster.portrait || movie.poster.landscape || '';
    return '';
  };

  return (
    <div className="watchlist-item" style={{
      backgroundColor: movie.status === 'watched' ? 'rgba(46, 204, 113, 0.05)' : 'transparent',
      borderRadius: '8px',
      marginBottom: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div className="watchlist-item-header" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        cursor: 'pointer',
        backgroundColor: '#272634',
        position: 'relative'
      }} onClick={() => setExpanded(!expanded)}>
        <div className="movie-poster" style={{ width: '60px', marginRight: '15px', flexShrink: 0 }}>
          <img 
            src={getPosterUrl()} 
            alt={movie.title}
            style={{ width: '100%', borderRadius: '4px' }}
          />
        </div>
        <div className="movie-info" style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
          <div style={{ fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: movie.status === 'watched' ? '#2ecc71' : '#f39c12',
              color: 'white',
              marginRight: '10px'
            }}>
              {movie.status === 'watched' ? 'Ditonton' : 'Belum Ditonton'}
            </span>
            <span>Ditambahkan pada: {new Date(movie.addedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
          ▼
        </div>
      </div>
      {expanded && (
        <div className="watchlist-item-details" style={{
          padding: '0 15px 15px 15px',
          backgroundColor: '#272634'
        }}>
          {movie.description && (
            <div className="description" style={{ marginBottom: '15px' }}>
              <h4 style={{ fontSize: '14px', color: '#ccc', marginBottom: '5px' }}>Deskripsi:</h4>
              <p style={{ fontSize: '14px', color: '#999', margin: 0, lineHeight: '1.5' }}>
                {movie.description || movie.overview || 'Tidak ada deskripsi tersedia.'}
              </p>
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>
            Ditambahkan pada: {new Date(movie.addedAt).toLocaleDateString()}
          </div>
          <div className="actions" style={{ display: 'flex', gap: '8px' }}>
            {movie.status !== 'watched' && (
              <button 
                onClick={() => onMarkWatched(movie.id)}
                style={{ 
                  flex: '1',
                  padding: '8px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Tandai Sudah Ditonton
              </button>
            )}
            <button 
              onClick={() => onRemove(movie.id)}
              style={{ 
                flex: '1',
                padding: '8px',
                backgroundColor: '#e53935',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MyList = () => {
  // State untuk mengontrol tab aktif
  const [activeTab, setActiveTab] = useState('favorites');
  
  // State untuk menyimpan daftar film
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  
  // State untuk loading
  const [loading, setLoading] = useState(true);

  // State untuk menampilkan notifikasi
  const [notification, setNotification] = useState(null);

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    loadData();
  }, []);

  // Fungsi untuk memuat data dari localStorage
  const loadData = () => {
    setLoading(true);
    
    // Ambil data favorit dan watchlist dari localStorage
    const favoritesList = favoritesStorage.getFavorites();
    const watchlistItems = watchlistStorage.getWatchlist();
    
    setFavorites(favoritesList);
    setWatchlist(watchlistItems);
    setLoading(false);
  };

  // Handler untuk menghapus film dari favorit
  const handleRemoveFavorite = (id) => {
    const success = favoritesStorage.removeFavorite(id);
    
    if (success) {
      // Perbarui state
      setFavorites(prevFavorites => prevFavorites.filter(movie => movie.id !== id));
      showNotification('Film berhasil dihapus dari daftar favorit');
      return true;
    } else {
      showNotification('Gagal menghapus dari daftar favorit', 'error');
      return false;
    }
  };

  // Handler untuk menghapus film dari watchlist
  const handleRemoveWatchlist = (id) => {
    const success = watchlistStorage.removeFromWatchlist(id);
    
    if (success) {
      // Perbarui state
      setWatchlist(prevWatchlist => prevWatchlist.filter(movie => movie.id !== id));
      showNotification('Film berhasil dihapus dari watchlist');
      return true;
    } else {
      showNotification('Gagal menghapus dari watchlist', 'error');
      return false;
    }
  };

  // Handler untuk menandai film sebagai sudah ditonton
  const handleMarkAsWatched = (id) => {
    const success = watchlistStorage.updateWatchlistStatus(id, 'watched');
    
    if (success) {
      // Perbarui state
      setWatchlist(prevWatchlist => prevWatchlist.map(movie => 
        movie.id === id ? { ...movie, status: 'watched' } : movie
      ));
      showNotification('Film berhasil ditandai sebagai sudah ditonton');
      return true;
    } else {
      showNotification('Gagal memperbarui status film', 'error');
      return false;
    }
  };

  // Render daftar film favorit
  const renderFavorites = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Memuat data...</div>;
    }
    
    if (favorites.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#999' }}>
          <p>Belum ada film favorit. Tambahkan film ke favorit dengan menekan tombol hati pada film.</p>
        </div>
      );
    }
    
    return (
      <div className="favorites-grid" style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {favorites.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onRemove={handleRemoveFavorite} 
            type="grid"
          />
        ))}
      </div>
    );
  };

  // Render daftar watchlist
  const renderWatchlist = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Memuat data...</div>;
    }
    
    if (watchlist.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#999' }}>
          <p>Belum ada film di watchlist. Tambahkan film ke watchlist untuk ditonton nanti.</p>
        </div>
      );
    }
    
    return (
      <div className="watchlist-table" style={{ 
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        {watchlist.map(movie => (
          <WatchlistItem 
            key={movie.id} 
            movie={movie} 
            onRemove={handleRemoveWatchlist} 
            onMarkWatched={handleMarkAsWatched}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mylist-page">
      <Header />
      <main className="main-content" style={{ minHeight: 'calc(100vh - 200px)', backgroundColor: '#0F0E17' }}>
        <div className="container" style={{ paddingTop: '40px', maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <h1 style={{ marginBottom: '30px', fontSize: '28px', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Koleksi Film Saya</h1>
          
          {/* Tab Navigation */}
          <div className="tabs" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '30px',
            borderBottom: '1px solid #333',
            paddingBottom: '10px'
          }}>
            <button 
              onClick={() => setActiveTab('favorites')}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: activeTab === 'favorites' ? '#5142FC' : 'transparent',
                color: activeTab === 'favorites' ? 'white' : '#999',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === 'favorites' ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              Film Favorit Saya
            </button>
            <button 
              onClick={() => setActiveTab('watchlist')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'watchlist' ? '#5142FC' : 'transparent',
                color: activeTab === 'watchlist' ? 'white' : '#999',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === 'watchlist' ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              Watchlist Saya
            </button>
          </div>
          
          {/* Notifikasi */}
          {notification && (
            <div 
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: notification.type === 'error' ? '#e74c3c' : '#2ecc71',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                animation: 'slideInRight 0.3s ease-out'
              }}
            >
              {notification.message}
              <style jsx>{`
                @keyframes slideInRight {
                  from { transform: translateX(100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
              `}</style>
            </div>
          )}
          
          {/* Konten Tab */}
          <div className="tab-content">
            {activeTab === 'favorites' && (
              <div className="favorites-content" style={{ 
                backgroundColor: '#1F1D2B', 
                borderRadius: '12px', 
                padding: '20px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '40px'
              }}>
                <h2 style={{ fontSize: '22px', marginBottom: '20px', color: 'white' }}>Film Favorit Saya</h2>
                <p style={{ color: '#999', marginBottom: '20px' }}>
                  Film-film yang telah Anda tandai sebagai favorit akan muncul di sini.
                </p>
                {renderFavorites()}
              </div>
            )}
            
            {activeTab === 'watchlist' && (
              <div className="watchlist-content" style={{ 
                backgroundColor: '#1F1D2B', 
                borderRadius: '12px', 
                padding: '20px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '40px'
              }}>
                <h2 style={{ fontSize: '22px', marginBottom: '20px', color: 'white' }}>Watchlist Saya</h2>
                <p style={{ color: '#999', marginBottom: '20px' }}>
                  Kelola daftar film yang ingin Anda tonton di sini.
                </p>
                {renderWatchlist()}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyList;