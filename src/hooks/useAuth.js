import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook untuk menggunakan AuthContext
 * @returns {Object} Nilai context autentikasi
 */
export const useAuth = () => {
  return useContext(AuthContext);
};