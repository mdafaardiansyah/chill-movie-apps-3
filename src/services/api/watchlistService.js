import apiClient from './index';

/**
 * Service untuk mengelola operasi API terkait watchlist
 */
const watchlistService = {
  /**
   * Mendapatkan semua film dalam watchlist
   * @returns {Promise} Promise yang mengembalikan data watchlist
   */
  getWatchlist: async () => {
    try {
      const response = await apiClient.get('/watchlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  /**
   * Menambahkan film ke watchlist
   * @param {Object} movie - Data film yang akan ditambahkan
   * @returns {Promise} Promise yang mengembalikan data film yang ditambahkan
   */
  addToWatchlist: async (movie) => {
    try {
      const response = await apiClient.post('/watchlist', movie);
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  /**
   * Memperbarui status film dalam watchlist
   * @param {string|number} id - ID film dalam watchlist
   * @param {Object} movie - Data film yang diperbarui
   * @returns {Promise} Promise yang mengembalikan data film yang diperbarui
   */
  updateWatchlistItem: async (id, movie) => {
    try {
      const response = await apiClient.put(`/watchlist/${id}`, movie);
      return response.data;
    } catch (error) {
      console.error(`Error updating watchlist item with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Menghapus film dari watchlist
   * @param {string|number} id - ID film dalam watchlist
   * @returns {Promise} Promise yang mengembalikan status penghapusan
   */
  removeFromWatchlist: async (id) => {
    try {
      const response = await apiClient.delete(`/watchlist/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing from watchlist with id ${id}:`, error);
      throw error;
    }
  }
};

export default watchlistService;