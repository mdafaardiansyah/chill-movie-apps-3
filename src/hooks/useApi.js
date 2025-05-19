import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/index';

/**
 * Custom hook untuk mengelola panggilan API
 * @param {Function} apiFunction - Fungsi API yang akan dipanggil
 * @param {Array} dependencies - Array dependensi untuk useEffect
 * @param {Object} options - Opsi tambahan untuk konfigurasi hook
 * @returns {Object} Object yang berisi data, loading state, error, dan fungsi refresh
 */
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Opsi default
  const {
    maxRetries = 3,          // Jumlah maksimal percobaan ulang
    retryDelay = 1000,       // Delay dasar untuk retry (dalam ms)
    showRateLimitMessage = true // Tampilkan pesan rate limit
  } = options;

  // Fungsi untuk memanggil API dengan mekanisme retry dan caching
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mencoba maksimal sesuai maxRetries
      let lastError;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Jika forceRefresh, hapus cache untuk request ini
          if (forceRefresh && typeof apiFunction.getCacheKey === 'function') {
            const cacheKey = apiFunction.getCacheKey();
            if (cacheKey) apiClient.invalidateCache(cacheKey);
          }
          
          const result = await apiFunction();
          setData(result);
          setRetryCount(0); // Reset retry count setelah berhasil
          return result;
        } catch (err) {
          lastError = err;
          
          // Tangani rate limit error
          if (err.message.includes('rate limit') || 
              (err.response && err.response.status === 429)) {
            
            // Tampilkan pesan rate limit jika diaktifkan
            if (showRateLimitMessage && typeof window !== 'undefined') {
              console.warn(`Rate limit terlampaui. Mencoba lagi dalam ${retryDelay * Math.pow(2, attempt)}ms`);
            }
            
            // Tunggu dengan exponential backoff
            const backoffDelay = retryDelay * Math.pow(2, attempt) + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            continue; // Lanjutkan ke percobaan berikutnya
          }
          
          // Untuk network error, coba lagi dengan delay
          if (err.message.includes('Network Error')) {
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
              continue; // Lanjutkan ke percobaan berikutnya
            }
          }
          
          // Untuk error lain, berhenti mencoba
          break;
        }
      }
      
      // Jika semua percobaan gagal, lempar error terakhir
      setRetryCount(prev => prev + 1);
      const errorMessage = lastError.message || 'Terjadi kesalahan saat mengambil data';
      console.error('API Error:', errorMessage, lastError);
      
      // Pesan khusus untuk rate limit
      if (lastError.message.includes('rate limit') || 
          (lastError.response && lastError.response.status === 429)) {
        setError('Batas permintaan ke server terlampaui. Silakan coba lagi nanti.');
      } else {
        setError(errorMessage);
      }
      
      return null;
    } catch (err) {
      setRetryCount(prev => prev + 1);
      const errorMessage = err.message || 'Terjadi kesalahan saat mengambil data';
      console.error('API Error:', errorMessage, err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, maxRetries, retryDelay, showRateLimitMessage]);


  // Panggil API saat komponen dimount atau dependencies berubah
  useEffect(() => {
    fetchData(false); // Gunakan cache jika tersedia
  }, [fetchData]); // Menghapus spread dependencies untuk menghindari warning

  // Fungsi untuk memuat ulang data
  const refresh = useCallback((forceRefresh = true) => {
    // Secara default, refresh akan memaksa mengambil data baru (tidak menggunakan cache)
    return fetchData(forceRefresh);
  }, [fetchData]);

  // Fungsi untuk mencoba lagi setelah error rate limit
  const retryAfterRateLimit = useCallback(() => {
    // Tunggu sebentar sebelum mencoba lagi
    const delay = Math.min(5000 + (retryCount * 2000), 30000); // Maksimal 30 detik
    console.log(`Mencoba lagi setelah rate limit dalam ${delay}ms...`);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(fetchData(true));
      }, delay);
    });
  }, [fetchData, retryCount]);

  return { 
    data, 
    loading, 
    error, 
    refresh, 
    retryAfterRateLimit,
    retryCount 
  };
};

/**
 * Custom hook untuk mengelola operasi CRUD
 * @param {Object} services - Object berisi fungsi-fungsi service API
 * @returns {Object} Object berisi fungsi-fungsi CRUD dan state
 */
export const useCrud = (services) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil semua item
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await services.getAll();
      setItems(data);
      return data;
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
      return [];
    } finally {
      setLoading(false);
    }
  }, [services]);

  // Fungsi untuk menambah item baru
  const addItem = useCallback(async (item) => {
    try {
      setLoading(true);
      setError(null);
      const newItem = await services.add(item);
      setItems(prevItems => [...prevItems, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menambah data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [services]);

  // Fungsi untuk memperbarui item
  const updateItem = useCallback(async (id, item) => {
    try {
      setLoading(true);
      setError(null);
      const updatedItem = await services.update(id, item);
      setItems(prevItems =>
        prevItems.map(i => (i.id === id ? updatedItem : i))
      );
      return updatedItem;
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memperbarui data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [services]);

  // Fungsi untuk menghapus item
  const deleteItem = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await services.delete(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menghapus data');
      return false;
    } finally {
      setLoading(false);
    }
  }, [services]);

  // Panggil API saat komponen dimount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };
};

// Ekspor semua service API
import movieService, { getAllMovies, getTopRatedMovies, getTrendingMovies, getMoviesByGenre } from '../services/api/movieService';
import userCollectionService from '../services/api/userCollectionService';
import authService from '../services/api/authService';

// Ekspor fungsi-fungsi API movie
export { getAllMovies, getTopRatedMovies, getTrendingMovies, getMoviesByGenre };

// Ekspor userCollectionService sebagai watchlistService dan favoriteService untuk kompatibilitas dengan kode lama
export { movieService, userCollectionService, authService };

// Cache untuk menyimpan instance
const watchlistCache = new Map();
const favoritesCache = new Map();

export const watchlistService = {
  getWatchlist: async (userId = '1') => {
    try {
      const data = await userCollectionService.getWatchlist(userId);
      // Simpan data di cache
      watchlistCache.set(userId, data);
      return data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },
  
  addToWatchlist: async (userId = '1', movieData) => {
    try {
      // Jika adalah objek film, gunakan title atau id
      let movieId = movieData;
      if (typeof movieData === 'object') {
        if (movieData.id) {
          movieId = movieData.id;
        } else if (movieData.title) {
          movieId = movieData.title;
        }
      }
      
      const result = await userCollectionService.addToWatchlist(userId, movieId);
      
      // Perbarui cache
      const cache = watchlistCache.get(userId) || [];
      watchlistCache.set(userId, [...cache, result]);
      
      return result;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },
  
  updateWatchlistItem: async (id, data) => {
    try {
      const result = await userCollectionService.updateCollection(id, data);
      
      // Perbarui semua cache
      for (const [userId, cache] of watchlistCache.entries()) {
        if (cache) {
          const updatedCache = cache.map(item => item.id === id ? result : item);
          watchlistCache.set(userId, updatedCache);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error updating watchlist item:', error);
      throw error;
    }
  },
  
  removeFromWatchlist: async (id) => {
    try {
      await userCollectionService.removeFromCollection(id);
      
      // Perbarui semua cache
      for (const [userId, cache] of watchlistCache.entries()) {
        if (cache) {
          const updatedCache = cache.filter(item => item.id !== id);
          watchlistCache.set(userId, updatedCache);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },
  
  // Fungsi untuk refresh cache
  refreshWatchlist: async (userId = '1') => {
    watchlistCache.delete(userId);
    return watchlistService.getWatchlist(userId);
  }
};

export const favoriteService = {
  getFavorites: async (userId = '1') => {
    try {
      const data = await userCollectionService.getFavorites(userId);
      // Simpan data di cache
      favoritesCache.set(userId, data);
      return data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },
  
  addFavorite: async (userId = '1', movieData) => {
    try {
      // Jika adalah objek film, gunakan title atau id
      let movieId = movieData;
      if (typeof movieData === 'object') {
        if (movieData.id) {
          movieId = movieData.id;
        } else if (movieData.title) {
          movieId = movieData.title;
        }
      }
      
      const result = await userCollectionService.addToFavorites(userId, movieId);
      
      // Perbarui cache
      const cache = favoritesCache.get(userId) || [];
      favoritesCache.set(userId, [...cache, result]);
      
      return result;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },
  
  deleteFavorite: async (id) => {
    try {
      await userCollectionService.removeFromCollection(id);
      
      // Perbarui semua cache
      for (const [userId, cache] of favoritesCache.entries()) {
        if (cache) {
          const updatedCache = cache.filter(item => item.id !== id);
          favoritesCache.set(userId, updatedCache);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    }
  },
  
  // Fungsi untuk refresh cache
  refreshFavorites: async (userId = '1') => {
    favoritesCache.delete(userId);
    return favoriteService.getFavorites(userId);
  }
};