import apiClient from './index';

/**
 * Mendapatkan kunci cache untuk operasi API tertentu
 * @param {string} operation - Nama operasi API
 * @param {Object} params - Parameter tambahan untuk operasi
 * @returns {string} Kunci cache
 */
const getCacheKey = (operation, params = {}) => {
  return `movies:${operation}:${JSON.stringify(params)}`;
};

/**
 * Mendapatkan semua film
 * @returns {Promise} Promise yang mengembalikan data film
 */
export const getAllMovies = async () => {
  try {
    const response = await apiClient.get('/movies');
    return response.data;
  } catch (error) {
    // Periksa apakah error adalah rate limit
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit terlampaui saat mengambil semua film');
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error('Error fetching movies:', error);
    throw error;
  }
};
getAllMovies.getCacheKey = () => getCacheKey('getAll');

/**
 * Mendapatkan film berdasarkan ID
 * @param {string|number} id - ID film
 * @returns {Promise} Promise yang mengembalikan data film
 */
export const getMovieById = async (id) => {
  try {
    const response = await apiClient.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn(`Rate limit terlampaui saat mengambil film dengan id ${id}`);
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error(`Error fetching movie with id ${id}:`, error);
    throw error;
  }
};
getMovieById.getCacheKey = (id) => getCacheKey('getById', { id });

/**
 * Mendapatkan film trending
 * @returns {Promise} Promise yang mengembalikan data film trending
 */
export const getTrendingMovies = async () => {
  try {
    const response = await apiClient.get('/movies?isTrending=true');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit terlampaui saat mengambil film trending');
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};
getTrendingMovies.getCacheKey = () => getCacheKey('trending');

/**
 * Mendapatkan film dengan rating tertinggi
 * @returns {Promise} Promise yang mengembalikan data film dengan rating tertinggi
 */
export const getTopRatedMovies = async () => {
  try {
    // Mengambil film dengan isTopRated=true atau mengurutkan berdasarkan rating
    const response = await apiClient.get('/movies?isTopRated=true');
    if (response.data.length === 0) {
      // Jika tidak ada film dengan isTopRated=true, ambil berdasarkan rating
      const ratingResponse = await apiClient.get('/movies?_sort=rating&_order=desc&_limit=10');
      return ratingResponse.data;
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit terlampaui saat mengambil film dengan rating tertinggi');
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};
getTopRatedMovies.getCacheKey = () => getCacheKey('topRated');

/**
 * Mendapatkan film berdasarkan genre
 * @param {string} genre - Genre film yang dicari
 * @returns {Promise} Promise yang mengembalikan data film berdasarkan genre
 */
export const getMoviesByGenre = async (genre) => {
  try {
    // MockAPI tidak mendukung pencarian array secara langsung, jadi kita perlu
    // mengambil semua film dan memfilternya di sisi klien
    const response = await apiClient.get('/movies');
    const filteredMovies = response.data.filter(movie => 
      movie.genres && movie.genres.includes(genre)
    );
    return filteredMovies;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn(`Rate limit terlampaui saat mengambil film berdasarkan genre ${genre}`);
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error(`Error fetching movies by genre ${genre}:`, error);
    throw error;
  }
};
getMoviesByGenre.getCacheKey = (genre) => getCacheKey('byGenre', { genre });

/**
 * Menambahkan film baru
 * @param {Object} movieData - Data film yang akan ditambahkan
 * @returns {Promise} Promise yang mengembalikan data film yang ditambahkan
 */
export const addMovie = async (movieData) => {
  try {
    const response = await apiClient.post('/movies', movieData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit terlampaui saat menambahkan film');
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error('Error adding movie:', error);
    throw error;
  }
};
addMovie.getCacheKey = () => getCacheKey('add');

/**
 * Memperbarui film
 * @param {string|number} id - ID film
 * @param {Object} movieData - Data film yang akan diperbarui
 * @returns {Promise} Promise yang mengembalikan data film yang diperbarui
 */
export const updateMovie = async (id, movieData) => {
  try {
    const response = await apiClient.put(`/movies/${id}`, movieData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn(`Rate limit terlampaui saat memperbarui film dengan id ${id}`);
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error(`Error updating movie with id ${id}:`, error);
    throw error;
  }
};
updateMovie.getCacheKey = (id) => getCacheKey('update', { id });

/**
 * Menghapus film
 * @param {string|number} id - ID film
 * @returns {Promise} Promise yang mengembalikan status penghapusan
 */
export const deleteMovie = async (id) => {
  try {
    const response = await apiClient.delete(`/movies/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn(`Rate limit terlampaui saat menghapus film dengan id ${id}`);
      error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
    }
    console.error(`Error deleting movie with id ${id}:`, error);
    throw error;
  }
};
deleteMovie.getCacheKey = (id) => getCacheKey('delete', { id });

/**
 * Service untuk mengelola operasi API terkait film
 */
const movieService = {
  getCacheKey,
  getAllMovies,
  getMovieById,
  getTrendingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  addMovie,
  updateMovie,
  deleteMovie
};

export default movieService;
export { getCacheKey };