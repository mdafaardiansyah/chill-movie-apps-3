import apiClient from './index';

/**
 * Service untuk mengelola operasi API terkait autentikasi
 */
const authService = {
  /**
   * Mendaftarkan pengguna baru
   * @param {Object} userData - Data pengguna untuk registrasi
   * @returns {Promise} Promise yang mengembalikan data pengguna dan token
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Melakukan login pengguna
   * @param {Object} credentials - Kredensial login (username/email dan password)
   * @returns {Promise} Promise yang mengembalikan data pengguna dan token
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Melakukan logout pengguna
   * @returns {Promise} Promise yang mengembalikan status logout
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  /**
   * Memvalidasi token autentikasi
   * @returns {Promise} Promise yang mengembalikan data pengguna jika token valid
   */
  validateToken: async () => {
    try {
      const response = await apiClient.get('/auth/validate');
      return response.data;
    } catch (error) {
      console.error('Error validating token:', error);
      throw error;
    }
  }
};

export default authService;