// Auth utility functions and constants
import { useContext } from 'react';

/**
 * Custom hook to use the Auth Context
 * @param {Object} AuthContext - The authentication context
 * @returns {Object} The context value
 */
export const useAuth = (AuthContext) => {
  return useContext(AuthContext);
};