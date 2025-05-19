/**
 * Storage Service - Layanan untuk mengelola penyimpanan data di localStorage
 * Menggunakan pattern yang memisahkan logic storage dari komponen
 */

// Prefix untuk key storage untuk menghindari konflik dengan aplikasi lain
const STORAGE_PREFIX = 'chill_movie_app_';

// Key untuk menyimpan data film favorit
const FAVORITES_KEY = `${STORAGE_PREFIX}favorites`;

// Key untuk menyimpan data watchlist
const WATCHLIST_KEY = `${STORAGE_PREFIX}watchlist`;

/**
 * Mendapatkan data dari localStorage
 * @param {string} key - Key untuk mengambil data
 * @param {any} defaultValue - Nilai default jika data tidak ditemukan
 * @returns {any} Data yang tersimpan atau nilai default
 */
const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    // Jika item tidak ada, kembalikan nilai default
    if (item === null) return defaultValue;
    // Parse JSON jika ada data
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error saat mengambil data dari localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Menyimpan data ke localStorage
 * @param {string} key - Key untuk menyimpan data
 * @param {any} value - Data yang akan disimpan
 * @returns {boolean} Status keberhasilan operasi
 */
const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saat menyimpan data ke localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Menghapus data dari localStorage
 * @param {string} key - Key untuk menghapus data
 * @returns {boolean} Status keberhasilan operasi
 */
const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error saat menghapus data dari localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Service untuk mengelola film favorit
 */
export const favoritesStorage = {
  /**
   * Mendapatkan daftar film favorit
   * @returns {Array} Array berisi data film favorit
   */
  getFavorites: () => {
    return getItem(FAVORITES_KEY, []);
  },

  /**
   * Menambahkan film ke daftar favorit
   * @param {Object} movie - Data film yang akan ditambahkan
   * @returns {boolean} Status keberhasilan operasi
   */
  addFavorite: (movie) => {
    // Pastikan movie memiliki ID unik
    if (!movie || !movie.id) {
      console.error('Film tidak memiliki ID');
      return false;
    }

    const favorites = favoritesStorage.getFavorites();
    
    // Cek apakah film sudah ada di daftar favorit
    const existingIndex = favorites.findIndex(item => item.id === movie.id);
    
    // Jika sudah ada, tidak perlu ditambahkan lagi
    if (existingIndex >= 0) return true;
    
    // Tambahkan film baru ke daftar dengan tanggal ditambahkan
    const newFavorites = [
      ...favorites, 
      {
        ...movie,
        addedAt: new Date().toISOString()
      }
    ];
    
    return setItem(FAVORITES_KEY, newFavorites);
  },

  /**
   * Menghapus film dari daftar favorit
   * @param {string} movieId - ID film yang akan dihapus
   * @returns {boolean} Status keberhasilan operasi
   */
  removeFavorite: (movieId) => {
    if (!movieId) return false;
    
    const favorites = favoritesStorage.getFavorites();
    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    
    return setItem(FAVORITES_KEY, newFavorites);
  },

  /**
   * Memeriksa apakah film ada di daftar favorit
   * @param {string} movieId - ID film yang akan diperiksa
   * @returns {boolean} Status film di daftar favorit
   */
  isFavorite: (movieId) => {
    if (!movieId) return false;
    
    const favorites = favoritesStorage.getFavorites();
    return favorites.some(movie => movie.id === movieId);
  },

  /**
   * Menghapus semua film dari daftar favorit
   * @returns {boolean} Status keberhasilan operasi
   */
  clearFavorites: () => {
    return removeItem(FAVORITES_KEY);
  }
};

/**
 * Service untuk mengelola watchlist
 */
export const watchlistStorage = {
  /**
   * Mendapatkan daftar watchlist
   * @returns {Array} Array berisi data film dalam watchlist
   */
  getWatchlist: () => {
    return getItem(WATCHLIST_KEY, []);
  },

  /**
   * Menambahkan film ke watchlist
   * @param {Object} movie - Data film yang akan ditambahkan
   * @param {string} status - Status film ('watched' atau 'pending')
   * @returns {boolean} Status keberhasilan operasi
   */
  addToWatchlist: (movie, status = 'pending') => {
    // Pastikan movie memiliki ID unik
    if (!movie || !movie.id) {
      console.error('Film tidak memiliki ID');
      return false;
    }

    const watchlist = watchlistStorage.getWatchlist();
    
    // Cek apakah film sudah ada di watchlist
    const existingIndex = watchlist.findIndex(item => item.id === movie.id);
    
    // Jika sudah ada, perbarui status saja
    if (existingIndex >= 0) {
      watchlist[existingIndex].status = status;
      return setItem(WATCHLIST_KEY, watchlist);
    }
    
    // Tambahkan film baru ke watchlist
    const newWatchlist = [
      ...watchlist, 
      {
        ...movie,
        status,
        addedAt: new Date().toISOString()
      }
    ];
    
    return setItem(WATCHLIST_KEY, newWatchlist);
  },

  /**
   * Menghapus film dari watchlist
   * @param {string} movieId - ID film yang akan dihapus
   * @returns {boolean} Status keberhasilan operasi
   */
  removeFromWatchlist: (movieId) => {
    if (!movieId) return false;
    
    const watchlist = watchlistStorage.getWatchlist();
    const newWatchlist = watchlist.filter(movie => movie.id !== movieId);
    
    return setItem(WATCHLIST_KEY, newWatchlist);
  },

  /**
   * Memperbarui status film di watchlist
   * @param {string} movieId - ID film yang akan diperbarui
   * @param {string} status - Status baru film ('watched' atau 'pending')
   * @returns {boolean} Status keberhasilan operasi
   */
  updateWatchlistStatus: (movieId, status) => {
    if (!movieId) return false;
    
    const watchlist = watchlistStorage.getWatchlist();
    const movieIndex = watchlist.findIndex(movie => movie.id === movieId);
    
    if (movieIndex === -1) return false;
    
    watchlist[movieIndex].status = status;
    return setItem(WATCHLIST_KEY, watchlist);
  },

  /**
   * Memeriksa apakah film ada di watchlist
   * @param {string} movieId - ID film yang akan diperiksa
   * @returns {boolean} Status film di watchlist
   */
  isInWatchlist: (movieId) => {
    if (!movieId) return false;
    
    const watchlist = watchlistStorage.getWatchlist();
    return watchlist.some(movie => movie.id === movieId);
  },

  /**
   * Menghapus semua film dari watchlist
   * @returns {boolean} Status keberhasilan operasi
   */
  clearWatchlist: () => {
    return removeItem(WATCHLIST_KEY);
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  favoritesStorage,
  watchlistStorage
}; 