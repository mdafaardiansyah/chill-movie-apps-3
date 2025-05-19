import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import movieService from '../services/api/movieService';
import apiClient from '../services/api/index';
import { MOVIE_GENRES } from '../data';
import '../styles/admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: '',
    duration: '',
    rating: '',
    genres: [],
    director: '',
    posterUrl: '',
    backdropUrl: '',
    isTrending: false,
    isTopRated: false
  });

  // Mengambil data film saat komponen dimuat
  useEffect(() => {
    fetchMovies();
  }, []);

  // Fungsi untuk mengambil data film
  const fetchMovies = async () => {
    try {
      setLoading(true);
      // Invalidasi cache untuk memastikan data terbaru
      apiClient.invalidateCache(movieService.getAllMovies.getCacheKey());
      const data = await movieService.getAllMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Gagal memuat daftar film');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menangani perubahan pada form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'genres') {
      // Menangani multiple select untuk genres
      const options = e.target.options;
      const selectedGenres = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedGenres.push(options[i].value);
        }
      }
      setFormData({ ...formData, genres: selectedGenres });
    } else {
      // Menangani input lainnya
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validasi data
      if (!formData.title || !formData.description) {
        setError('Judul dan deskripsi film wajib diisi');
        setLoading(false);
        return;
      }

      // Konversi nilai numerik
      const movieData = {
        ...formData,
        releaseYear: parseInt(formData.releaseYear) || new Date().getFullYear(),
        duration: parseInt(formData.duration) || 0,
        rating: parseFloat(formData.rating) || 0
      };

      let result;
      if (selectedMovie) {
        // Update film yang sudah ada
        result = await movieService.updateMovie(selectedMovie.id, movieData);
        alert(`Film "${result.title}" berhasil diperbarui`);
      } else {
        // Tambah film baru
        result = await movieService.addMovie(movieData);
        alert(`Film "${result.title}" berhasil ditambahkan`);
      }

      // Ambil data terbaru dari server setelah operasi berhasil
      await fetchMovies();
      
      // Reset form
      resetForm();
    } catch (err) {
      console.error('Error saving movie:', err);
      setError(`Gagal ${selectedMovie ? 'memperbarui' : 'menambahkan'} film: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengedit film
  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      releaseYear: movie.releaseYear || '',
      duration: movie.duration || '',
      rating: movie.rating || '',
      genres: movie.genres || [],
      director: movie.director || '',
      posterUrl: movie.posterUrl || '',
      backdropUrl: movie.backdropUrl || '',
      isTrending: movie.isTrending || false,
      isTopRated: movie.isTopRated || false
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Fungsi untuk menghapus film
  const handleDelete = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus film "${title}"?`)) {
      try {
        setLoading(true);
        await movieService.deleteMovie(id);
        alert(`Film "${title}" berhasil dihapus`);
        // Invalidasi cache dan ambil data terbaru
        await fetchMovies();
      } catch (err) {
        console.error('Error deleting movie:', err);
        setError(`Gagal menghapus film: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fungsi untuk mereset form
  const resetForm = () => {
    setSelectedMovie(null);
    setFormData({
      title: '',
      description: '',
      releaseYear: '',
      duration: '',
      rating: '',
      genres: [],
      director: '',
      posterUrl: '',
      backdropUrl: '',
      isTrending: false,
      isTopRated: false
    });
    setShowForm(false);
    setError(null);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel - Kelola Film</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Tutup Form' : 'Tambah Film Baru'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/home')}
        >
          Kembali ke Beranda
        </button>
      </div>

      {showForm && (
        <div className="movie-form-container">
          <h2>{selectedMovie ? 'Edit Film' : 'Tambah Film Baru'}</h2>
          <form onSubmit={handleSubmit} className="movie-form">
            <div className="form-group">
              <label htmlFor="title">Judul Film*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Deskripsi*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="releaseYear">Tahun Rilis</label>
                <input
                  type="number"
                  id="releaseYear"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Durasi (menit)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="genres">Genre (tahan Ctrl untuk pilih beberapa)</label>
              <select
                id="genres"
                name="genres"
                multiple
                value={formData.genres}
                onChange={handleChange}
              >
                {MOVIE_GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="director">Sutradara</label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="posterUrl">URL Poster Landscape (288x162)</label>
              <input
                type="text"
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://example.com/poster-landscape.jpg"
              />
              <small>Digunakan untuk tampilan carousel landscape</small>
            </div>

            <div className="form-group">
              <label htmlFor="backdropUrl">URL Poster Portrait (200x300)</label>
              <input
                type="text"
                id="backdropUrl"
                name="backdropUrl"
                value={formData.backdropUrl}
                onChange={handleChange}
                placeholder="https://example.com/poster-portrait.jpg"
              />
              <small>Digunakan untuk tampilan poster portrait</small>
            </div>

            <div className="form-row checkbox-group">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleChange}
                  />
                  Trending
                </label>
                <small>Film akan ditampilkan di bagian Trending</small>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isTopRated"
                    checked={formData.isTopRated}
                    onChange={handleChange}
                  />
                  Top Rated
                </label>
                <small>Film akan ditampilkan di bagian Top Rated</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : (selectedMovie ? 'Perbarui Film' : 'Tambah Film')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="movies-list">
        <h2>Daftar Film</h2>
        {loading && !showForm ? (
          <p>Memuat data film...</p>
        ) : movies.length === 0 ? (
          <p>Tidak ada film yang tersedia.</p>
        ) : (
          <table className="movies-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Tahun</th>
                <th>Rating</th>
                <th>Genre</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.releaseYear}</td>
                  <td>{movie.rating}</td>
                  <td>{movie.genres?.join(', ')}</td>
                  <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(movie.id, movie.title)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;