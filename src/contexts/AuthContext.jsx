import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/api/index';

// Membuat context untuk autentikasi
export const AuthContext = createContext();

// Provider component untuk AuthContext
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memeriksa status autentikasi saat aplikasi dimuat
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Cek token di localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
          // Validasi token dengan API
          const response = await apiClient.get('/auth/validate');
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        console.error('Error validating auth token:', err);
        // Jika token tidak valid, hapus dari localStorage
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Fungsi untuk login
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      // Panggil API login
      const response = await apiClient.post('/auth/login', credentials);
      // Simpan token di localStorage
      localStorage.setItem('authToken', response.data.token);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Gagal melakukan login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk logout
  const logout = async () => {
    try {
      setLoading(true);
      // Panggil API logout jika diperlukan
      await apiClient.post('/auth/logout');
      // Hapus token dari localStorage
      localStorage.removeItem('authToken');
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Tetap hapus token meskipun API gagal
      localStorage.removeItem('authToken');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk register
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      // Panggil API register
      const response = await apiClient.post('/auth/register', userData);
      // Simpan token di localStorage jika register sekaligus login
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setCurrentUser(response.data.user);
      }
      return response.data;
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Gagal melakukan registrasi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Nilai yang akan disediakan oleh context
  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};