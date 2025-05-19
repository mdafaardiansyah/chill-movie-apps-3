import apiClient from './index';

/**
 * Service untuk mengelola operasi API terkait film favorit
 */
const favoriteService = {
  /**
   * Mendapatkan semua film favorit
   * @returns {Promise} Promise yang mengembalikan data film favorit
   */
  getFavorites: async () => {
    try {
      const response = await apiClient.get('/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  /**
   * Menambahkan film ke daftar favorit
   * @param {Object} movie - Data film yang akan ditambahkan
   * @returns {Promise} Promise yang mengembalikan data film yang ditambahkan
   */
  addFavorite: async (movie) => {
    try {
      const response = await apiClient.post('/favorites', movie);
      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  /**
   * Memperbarui data film favorit
   * @param {string|number} id - ID film favorit
   * @param {Object} movie - Data film yang diperbarui
   * @returns {Promise} Promise yang mengembalikan data film yang diperbarui
   */
  updateFavorite: async (id, movie) => {
    try {
      const response = await apiClient.put(`/favorites/${id}`, movie);
      return response.data;
    } catch (error) {
      console.error(`Error updating favorite with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Menghapus film dari daftar favorit
   * @param {string|number} id - ID film favorit
   * @returns {Promise} Promise yang mengembalikan status penghapusan
   */
  deleteFavorite: async (id) => {
    try {
      const response = await apiClient.delete(`/favorites/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting favorite with id ${id}:`, error);
      throw error;
    }
  }
};

export default favoriteService;