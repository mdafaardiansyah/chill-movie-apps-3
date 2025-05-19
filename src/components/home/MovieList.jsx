import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import addIcon from '../../assets/images/icons/plus.png';
import deleteIcon from '../../assets/images/icons/delete.png';
import editIcon from '../../assets/images/icons/edit.png';
// Import data genre dari folder data
import { MOVIE_GENRES } from '../../data';
// Import service untuk mendapatkan data film favorit
import { favoriteService } from '../../hooks/useApi';

/**
 * Komponen untuk menampilkan daftar film dalam berbagai format
 * @param {Array} movies - Array berisi data film
 * @param {Function} onRemove - Fungsi untuk menghapus film
 * @param {String} type - Tipe tampilan (grid, list, carousel)
 * @param {Boolean} showRemoveButton - Apakah tombol hapus ditampilkan
 * @param {Boolean} showAddButton - Apakah tombol tambah ditampilkan
 * @returns {JSX.Element} Komponen daftar film
 */
const MovieList = ({ 
  movies: propMovies = [], 
  onRemove: propOnRemove, 
  onAdd: propOnAdd, 
  onEdit: propOnEdit, 
  type = 'grid', 
  showRemoveButton = false,
  showAddButton = false,
  showEditButton = false,
  onNotification
}) => {
  // State untuk menyimpan daftar film
  const [movies, setMovies] = useState(propMovies);
  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mengambil data film favorit saat komponen dimuat (jika tidak ada movies yang diberikan)
  useEffect(() => {
    // Jika movies sudah diberikan melalui props, gunakan itu
    if (propMovies.length > 0) {
      setMovies(propMovies);
      setLoading(false);
      return;
    }

    // Jika tidak, ambil dari API
    fetchFavorites();
  }, [propMovies, fetchFavorites]);

  // Fungsi untuk mengambil data film favorit
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      // Gunakan userId='1' sebagai default untuk demo
      const data = await favoriteService.getFavorites('1');
      setMovies(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Gagal memuat daftar film favorit');
      setLoading(false);
      if (onNotification) {
        onNotification('Gagal memuat daftar film favorit', 'error');
      }
    }
  }, [onNotification]);

  // Fungsi untuk menyegarkan data
  const refreshData = async () => {
    try {
      setLoading(true);
      const refreshedData = await favoriteService.refreshFavorites('1');
      setMovies(refreshedData);
      if (onNotification) {
        onNotification('Daftar film berhasil disegarkan', 'success');
      }
    } catch (err) {
      console.error('Error refreshing favorites:', err);
      if (onNotification) {
        onNotification('Gagal menyegarkan daftar film', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus film
  const handleDeleteMovie = async (id) => {
    // Simpan judul film yang akan dihapus untuk notifikasi
    const movieToDelete = movies.find(movie => movie.id === id);
    const movieTitle = movieToDelete ? movieToDelete.title : 'Film';

    if (window.confirm(`Apakah Anda yakin ingin menghapus "${movieTitle}" dari daftar favorit?`)) {
      try {
        if (propOnRemove) {
          await propOnRemove(id);
        } else {
          // Gunakan API untuk menghapus
          await favoriteService.deleteFavorite(id);
          // Perbarui tampilan dengan menghapus film dari state
          setMovies(movies.filter(movie => movie.id !== id));
          
          if (onNotification) {
            onNotification(`Film "${movieTitle}" berhasil dihapus dari favorit`, 'success');
          }
        }
      } catch (err) {
        console.error('Error deleting movie:', err);
        if (onNotification) {
          onNotification('Gagal menghapus film dari favorit', 'error');
        } else {
          alert('Gagal menghapus film');
        }
      }
    }
  };

  // State untuk form penambahan/edit film
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    rating: ''
  });

  // State untuk mode edit
  const [editMode, setEditMode] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState(null);
  
  // State untuk menampilkan form
  const [showForm, setShowForm] = useState(false);

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handler untuk menambah film baru
  const handleAddMovie = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.genre || !formData.rating) {
      if (onNotification) {
        onNotification('Semua field harus diisi!', 'error');
      } else {
        alert('Semua field harus diisi!');
      }
      return;
    }

    const newMovie = {
      title: formData.title,
      genre: formData.genre,
      rating: parseFloat(formData.rating)
    };

    try {
      setLoading(true);
      if (propOnAdd) {
        await propOnAdd(newMovie);
      } else {
        // Tambahkan langsung ke favorit
        await favoriteService.addFavorite('1', newMovie);
        // Segarkan data untuk menampilkan favorit yang baru ditambahkan
        await refreshData();
      }
      resetForm();
      if (onNotification) {
        onNotification(`Film "${newMovie.title}" berhasil ditambahkan`, 'success');
      }
    } catch (err) {
      console.error('Error adding movie:', err);
      if (onNotification) {
        onNotification('Gagal menambahkan film', 'error');
      } else {
        alert('Gagal menambahkan film');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk mengedit film
  const handleEditMovie = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.genre || !formData.rating) {
      if (onNotification) {
        onNotification('Semua field harus diisi!', 'error');
      } else {
        alert('Semua field harus diisi!');
      }
      return;
    }

    const updatedMovie = {
      title: formData.title,
      genre: formData.genre,
      rating: parseFloat(formData.rating)
    };

    try {
      setLoading(true);
      if (propOnEdit) {
        await propOnEdit(currentMovieId, updatedMovie);
        if (onNotification) {
          onNotification(`Film "${updatedMovie.title}" berhasil diperbarui`, 'success');
        }
      }
      resetForm();
    } catch (err) {
      console.error('Error updating movie:', err);
      if (onNotification) {
        onNotification('Gagal memperbarui film', 'error');
      } else {
        alert('Gagal memperbarui film');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk memulai edit film
  const startEditMovie = (movie) => {
    setFormData({
      title: movie.title,
      genre: movie.genre || (movie.genres && movie.genres.join(', ')) || '',
      rating: movie.rating ? movie.rating.toString() : '0'
    });
    setEditMode(true);
    setCurrentMovieId(movie.id);
    setShowForm(true);
  };

  // Reset form setelah submit
  const resetForm = () => {
    setFormData({
      title: '',
      genre: '',
      rating: ''
    });
    setEditMode(false);
    setCurrentMovieId(null);
    setShowForm(false);
  };

  // Jika sedang loading, tampilkan pesan loading
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="loading-spinner" style={{ 
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#5142FC',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '15px', color: '#fff' }}>Memuat daftar film...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Jika ada error, tampilkan pesan error
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>
        <p>{error}</p>
        <button 
          onClick={refreshData}
          style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#5142FC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      {showAddButton && (
        <div className="movie-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ color: 'white' }}>Daftar Film</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={refreshData}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 16px',
                backgroundColor: '#3A3950',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              <span style={{ marginRight: '5px' }}>↻</span>
              Segarkan
            </button>
            <button 
              className="add-button"
              onClick={() => setShowForm(!showForm)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 16px',
                backgroundColor: '#5142FC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              <img src={addIcon} alt="Add" style={{ width: '16px', marginRight: '8px' }} />
              Tambah Film
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="movie-form" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#1F1D2B', borderRadius: '8px', border: '1px solid #3A3950' }}>
          <h3 style={{ color: 'white' }}>{editMode ? 'Edit Film' : 'Tambah Film Baru'}</h3>
          <form onSubmit={editMode ? handleEditMovie : handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label htmlFor="title" style={{ color: 'white', marginBottom: '5px', display: 'block' }}>Judul Film:</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#2B2A3A', border: '1px solid #3A3950', color: 'white' }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre" style={{ color: 'white', marginBottom: '5px', display: 'block' }}>Genre:</label>
              <select 
                id="genre" 
                name="genre" 
                value={formData.genre} 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#2B2A3A', border: '1px solid #3A3950', color: 'white' }}
              >
                <option value="">Pilih Genre</option>
                {MOVIE_GENRES.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="rating" style={{ color: 'white', marginBottom: '5px', display: 'block' }}>Rating:</label>
              <input 
                type="number" 
                id="rating" 
                name="rating"
                min="0" 
                max="5" 
                step="0.1" 
                value={formData.rating} 
                onChange={handleInputChange} 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#2B2A3A', border: '1px solid #3A3950', color: 'white' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: '#5142FC', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
                disabled={loading}
              >
                {loading ? (editMode ? 'Menyimpan...' : 'Menambahkan...') : (editMode ? 'Simpan Perubahan' : 'Tambah Film')}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                style={{ 
                  backgroundColor: '#3A3950', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
                disabled={loading}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tampilan daftar film dengan gaya CSS inline */}
      {movies.length === 0 ? (
        <div className="empty-state" style={{ 
          textAlign: 'center', 
          padding: '50px 20px', 
          backgroundColor: '#1F1D2B', 
          borderRadius: '8px',
          border: '1px dashed #3A3950'
        }}>
          <p style={{ fontSize: '18px', color: '#999' }}>Belum ada film di daftar ini.</p>
          {showAddButton && (
            <button 
              onClick={() => setShowForm(true)}
              style={{ 
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#5142FC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                margin: '15px auto 0'
              }}
            >
              <img src={addIcon} alt="Add" style={{ width: '16px', height: '16px' }} />
              Tambah Film Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className={`movie-list movie-list-${type}`} style={{ 
          display: type === 'grid' ? 'grid' : 'block',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card" style={{ 
              backgroundColor: '#1F1D2B',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              position: 'relative',
              border: '1px solid #3A3950',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }
            }}>
              <div className="movie-card-image" style={{ position: 'relative', height: '200px', backgroundColor: '#2B2A3A' }}>
                {movie.poster?.portrait ? (
                  <img 
                    src={movie.poster.portrait} 
                    alt={movie.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#2B2A3A',
                    color: '#757575',
                    fontSize: '18px'
                  }}>
                    No Image
                  </div>
                )}
                
                {/* Badge untuk status film */}
                {movie.badge && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '10px', 
                    padding: '4px 8px', 
                    backgroundColor: '#5142FC', 
                    color: 'white', 
                    borderRadius: '4px', 
                    fontSize: '12px'
                  }}>
                    {movie.badge.text}
                  </span>
                )}
                
                {/* Aksi untuk edit dan hapus */}
                <div className="movie-actions" style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '5px'
                }}>
                  {showEditButton && (
                    <button 
                      onClick={() => startEditMovie(movie)}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: '#5142FC', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#4030c0'
                        }
                      }}
                    >
                      <img src={editIcon} alt="Edit" style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                  
                  {showRemoveButton && (
                    <button 
                      onClick={() => handleDeleteMovie(movie.id)}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: '#e74c3c', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#c0392b'
                        }
                      }}
                    >
                      <img src={deleteIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="movie-card-info" style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'white' }}>{movie.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: '#3A3950',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#ddd'
                  }}>
                    {movie.genre || (movie.genres && movie.genres.join(', ')) || 'Tidak ada genre'}
                  </span>
                  <span style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: '#FFA500',
                    fontWeight: 'bold'
                  }}>
                    ★ {movie.rating || '0'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;