import apiClient from './index';

/**
 * Service untuk mengelola operasi API terkait koleksi pengguna
 * (favorit, watchlist, dan continue watching)
 */
const userCollectionService = {
  /**
   * Mendapatkan semua koleksi pengguna
   * @param {string} userId - ID pengguna
   * @returns {Promise} Promise yang mengembalikan data koleksi
   */
  getAllCollections: async (userId) => {
    try {
      const response = await apiClient.get(`/user_collections?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user collections:', error);
      throw error;
    }
  },

  /**
   * Mendapatkan koleksi berdasarkan tipe
   * @param {string} userId - ID pengguna
   * @param {string} collectionType - Tipe koleksi ('favorite', 'watchlist', atau 'continueWatching')
   * @returns {Promise} Promise yang mengembalikan data koleksi
   */
  getCollectionByType: async (userId, collectionType) => {
    try {
      const response = await apiClient.get(`/user_collections?userId=${userId}&collectionType=${collectionType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${collectionType} collection:`, error);
      throw error;
    }
  },

  /**
   * Mendapatkan daftar favorit pengguna
   * @param {string} userId - ID pengguna
   * @returns {Promise} Promise yang mengembalikan data favorit
   */
  getFavorites: async (userId) => {
    return userCollectionService.getCollectionByType(userId, 'favorite');
  },

  /**
   * Mendapatkan daftar watchlist pengguna
   * @param {string} userId - ID pengguna
   * @returns {Promise} Promise yang mengembalikan data watchlist
   */
  getWatchlist: async (userId) => {
    return userCollectionService.getCollectionByType(userId, 'watchlist');
  },

  /**
   * Mendapatkan daftar film yang sedang ditonton pengguna
   * @param {string} userId - ID pengguna
   * @returns {Promise} Promise yang mengembalikan data film yang sedang ditonton
   */
  getContinueWatching: async (userId) => {
    return userCollectionService.getCollectionByType(userId, 'continueWatching');
  },

  /**
   * Menambahkan film ke koleksi pengguna
   * @param {Object} collection - Data koleksi yang akan ditambahkan
   * @returns {Promise} Promise yang mengembalikan data koleksi yang ditambahkan
   */
  addToCollection: async (collection) => {
    try {
      const response = await apiClient.post('/user_collections', collection);
      return response.data;
    } catch (error) {
      console.error('Error adding to collection:', error);
      throw error;
    }
  },

  /**
   * Menambahkan film ke daftar favorit
   * @param {string} userId - ID pengguna
   * @param {string} movieId - ID film
   * @returns {Promise} Promise yang mengembalikan data favorit yang ditambahkan
   */
  addToFavorites: async (userId, movieId) => {
    const collection = {
      userId,
      movieId,
      collectionType: 'favorite',
      addedAt: new Date().toISOString()
    };
    return userCollectionService.addToCollection(collection);
  },

  /**
   * Menambahkan film ke watchlist
   * @param {string} userId - ID pengguna
   * @param {string} movieId - ID film
   * @returns {Promise} Promise yang mengembalikan data watchlist yang ditambahkan
   */
  addToWatchlist: async (userId, movieId) => {
    const collection = {
      userId,
      movieId,
      collectionType: 'watchlist',
      status: 'pending',
      addedAt: new Date().toISOString()
    };
    return userCollectionService.addToCollection(collection);
  },

  /**
   * Menambahkan film ke daftar continue watching
   * @param {string} userId - ID pengguna
   * @param {string} movieId - ID film
   * @param {number} progress - Persentase progres menonton
   * @returns {Promise} Promise yang mengembalikan data continue watching yang ditambahkan
   */
  addToContinueWatching: async (userId, movieId, progress = 0) => {
    const collection = {
      userId,
      movieId,
      collectionType: 'continueWatching',
      progress,
      addedAt: new Date().toISOString()
    };
    return userCollectionService.addToCollection(collection);
  },

  /**
   * Memperbarui item koleksi
   * @param {string} id - ID koleksi
   * @param {Object} data - Data yang akan diperbarui
   * @returns {Promise} Promise yang mengembalikan data koleksi yang diperbarui
   */
  updateCollection: async (id, data) => {
    try {
      const response = await apiClient.put(`/user_collections/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating collection with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Memperbarui progres menonton
   * @param {string} id - ID koleksi
   * @param {number} progress - Persentase progres menonton
   * @returns {Promise} Promise yang mengembalikan data yang diperbarui
   */
  updateWatchingProgress: async (id, progress) => {
    return userCollectionService.updateCollection(id, { progress });
  },

  /**
   * Memperbarui status watchlist
   * @param {string} id - ID koleksi
   * @param {string} status - Status baru
   * @returns {Promise} Promise yang mengembalikan data yang diperbarui
   */
  updateWatchlistStatus: async (id, status) => {
    return userCollectionService.updateCollection(id, { status });
  },

  /**
   * Menghapus item dari koleksi
   * @param {string} id - ID koleksi
   * @returns {Promise} Promise yang mengembalikan status penghapusan
   */
  removeFromCollection: async (id) => {
    try {
      const response = await apiClient.delete(`/user_collections/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing from collection with id ${id}:`, error);
      throw error;
    }
  }
};

export default userCollectionService;