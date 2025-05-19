import React, { useState, useEffect, useCallback } from 'react';
import addIcon from '../../assets/images/icons/plus.png';
import deleteIcon from '../../assets/images/icons/delete.png';
import checkIcon from '../../assets/images/icons/check.png';
// Import service API untuk watchlist
import { watchlistService } from '../../hooks/useApi';

const WatchlistManager = ({ onNotification }) => {
  // State untuk menyimpan daftar film yang ingin ditonton
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mengambil data watchlist dari API saat komponen dimuat
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Fungsi untuk mengambil data watchlist
  const fetchWatchlist = useCallback(async () => {
    try {
      setIsLoading(true);
      // Menggunakan userId '1' untuk demo
      const data = await watchlistService.getWatchlist('1');
      setWatchlist(data);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Gagal memuat data watchlist');
      if (onNotification) {
        onNotification('Gagal memuat data watchlist', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [onNotification]);

  // State untuk form penambahan film
  const [newMovieTitle, setNewMovieTitle] = useState('');
  
  // State untuk menampilkan form
  const [showForm, setShowForm] = useState(false);

  // Handler untuk menambah film baru ke watchlist
  const handleAddToWatchlist = async (e) => {
    e.preventDefault();
    
    if (!newMovieTitle.trim()) {
      if (onNotification) {
        onNotification('Judul film tidak boleh kosong!', 'error');
      } else {
        alert('Judul film tidak boleh kosong!');
      }
      return;
    }

    const newMovie = {
      title: newMovieTitle.trim(),
      status: "pending"
    };

    try {
      setIsLoading(true);
      // Menggunakan userId '1' untuk demo
      const addedMovie = await watchlistService.addToWatchlist('1', newMovie);
      setWatchlist([...watchlist, addedMovie]);
      setNewMovieTitle('');
      setShowForm(false);
      if (onNotification) {
        onNotification('Film berhasil ditambahkan ke watchlist', 'success');
      }
    } catch (err) {
      console.error('Error adding movie to watchlist:', err);
      if (onNotification) {
        onNotification('Gagal menambahkan film ke watchlist', 'error');
      } else {
        alert('Gagal menambahkan film ke watchlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk menandai film sudah ditonton
  const handleMarkAsWatched = async (id) => {
    try {
      const movieToUpdate = watchlist.find(movie => movie.id === id);
      if (!movieToUpdate) return;
      
      const updatedStatus = movieToUpdate.status === "watched" ? "pending" : "watched";
      
      const updatedMovie = {
        ...movieToUpdate,
        status: updatedStatus
      };
      
      const result = await watchlistService.updateWatchlistItem(id, updatedMovie);
      
      setWatchlist(watchlist.map(movie => {
        if (movie.id === id) {
          return result;
        }
        return movie;
      }));

      if (onNotification) {
        const message = updatedStatus === "watched" 
          ? `Film "${movieToUpdate.title}" ditandai sudah ditonton` 
          : `Film "${movieToUpdate.title}" ditandai belum ditonton`;
        onNotification(message, 'success');
      }
    } catch (err) {
      console.error('Error updating watchlist item:', err);
      if (onNotification) {
        onNotification('Gagal memperbarui status film', 'error');
      } else {
        alert('Gagal memperbarui status film');
      }
    }
  };

  // Handler untuk menghapus film dari watchlist
  const handleRemoveFromWatchlist = async (id) => {
    // Dapatkan judul film sebelum dihapus untuk notifikasi
    const movieToDelete = watchlist.find(movie => movie.id === id);
    const movieTitle = movieToDelete ? movieToDelete.title : 'Film';

    if (window.confirm(`Apakah Anda yakin ingin menghapus "${movieTitle}" dari watchlist?`)) {
      try {
        await watchlistService.removeFromWatchlist(id);
        const filteredWatchlist = watchlist.filter(movie => movie.id !== id);
        setWatchlist(filteredWatchlist);
        if (onNotification) {
          onNotification(`Film "${movieTitle}" berhasil dihapus dari watchlist`, 'success');
        }
      } catch (err) {
        console.error('Error removing from watchlist:', err);
        if (onNotification) {
          onNotification('Gagal menghapus film dari watchlist', 'error');
        } else {
          alert('Gagal menghapus film dari watchlist');
        }
      }
    }
  };

  return (
    <section className="watchlist-section">
      <div className="container">
        <div className="watchlist-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
          <h2 className="watchlist-title">Watchlist Saya</h2>
          <button 
            className="btn btn-add" 
            onClick={() => setShowForm(!showForm)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#5142FC', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            disabled={isLoading}
          >
            <img src={addIcon} alt="Add" style={{ width: '16px', height: '16px' }} />
            Tambah ke Watchlist
          </button>
        </div>

        {showForm && (
          <div className="watchlist-form" style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#1F1D2B',border: '1px solid gray', borderRadius: '8px' }}>
            <h3>Tambah Film ke Watchlist</h3>
            <form onSubmit={handleAddToWatchlist} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input
                type="text"
                value={newMovieTitle}
                onChange={(e) => setNewMovieTitle(e.target.value)}
                placeholder="Judul film"
                style={{ flex: 1, padding: '8px', borderRadius: '4px', backgroundColor: '#2B2A3A', border: '1px solid #3A3950', color: 'white' }}
              />
              <button 
                type="submit" 
                style={{ padding: '8px 16px', backgroundColor: '#5142FC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                disabled={isLoading}
              >
                {isLoading ? 'Menambahkan...' : 'Tambah'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                style={{ padding: '8px 16px', backgroundColor: '#3A3950', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                disabled={isLoading}
              >
                Batal
              </button>
            </form>
          </div>
        )}

        {isLoading && !showForm ? (
          <div style={{ textAlign: 'center', padding: '40px 0', backgroundColor: '#1F1D2B', borderRadius: '8px' }}>
            <div className="loading-spinner" style={{ 
              margin: '0 auto',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: '#5142FC',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '15px' }}>Memuat watchlist...</p>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', backgroundColor: '#1F1D2B', borderRadius: '8px', color: 'red' }}>
            <p>{error}</p>
            <button 
              onClick={fetchWatchlist}
              style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#5142FC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Coba Lagi
            </button>
          </div>
        ) : watchlist.length > 0 ? (
          <div className="watchlist-items" style={{ backgroundColor: '#1F1D2B', borderRadius: '8px',border: '1px solid gray', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #3A3950' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Judul Film</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((movie) => (
                  <tr key={movie.id} style={{ borderBottom: '1px solid #3A3950' }}>
                    <td style={{ padding: '15px' }}>{movie.title}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: movie.status === 'watched' ? '#4CAF50' : '#FFA500',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {movie.status === 'watched' ? 'Sudah Ditonton' : 'Belum Ditonton'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button 
                          onClick={() => handleMarkAsWatched(movie.id)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          title={movie.status === 'watched' ? 'Tandai belum ditonton' : 'Tandai sudah ditonton'}
                        >
                          <img src={checkIcon} alt="Mark" style={{ 
                            width: '20px', 
                            height: '20px', 
                            opacity: movie.status === 'watched' ? 1 : 0.5,
                            transition: 'opacity 0.3s ease',
                            filter: movie.status === 'watched' ? 'none' : 'grayscale(100%)'
                          }} />
                        </button>
                        <button 
                          onClick={() => handleRemoveFromWatchlist(movie.id)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          title="Hapus dari watchlist"
                        >
                          <img src={deleteIcon} alt="Delete" style={{ 
                            width: '20px', 
                            height: '20px',
                            transition: 'transform 0.3s ease',
                            ':hover': {
                              transform: 'scale(1.2)'
                            }
                          }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ 
            textAlign: 'center', 
            padding: '40px 0', 
            backgroundColor: '#1F1D2B', 
            borderRadius: '8px',
            border: '1px dashed #3A3950'
          }}>
            <p>Watchlist Anda kosong. Tambahkan film yang ingin Anda tonton!</p>
            <button 
              onClick={() => setShowForm(true)}
              style={{ 
                marginTop: '15px',
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', 
                background: '#5142FC', 
                border: 'none', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                cursor: 'pointer',
                margin: '15px auto 0'
              }}
            >
              <img src={addIcon} alt="Add" style={{ width: '16px', height: '16px' }} />
              Tambah Film Sekarang
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WatchlistManager;