import axios from 'axios';

// Menggunakan URL API dari environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Mencatat URL API yang digunakan untuk debugging
console.log('Menggunakan API URL:', API_URL);

// Cache untuk menyimpan hasil request API
const apiCache = new Map();

// Konfigurasi cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit dalam milidetik

// Membuat instance axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fungsi untuk mendapatkan kunci cache dari konfigurasi request
const getCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
};

// Fungsi untuk memeriksa apakah response bisa di-cache
const isCacheable = (config) => {
  // Hanya cache request GET
  return config.method === 'get';
};

// Fungsi untuk mendapatkan data dari cache
const getFromCache = (cacheKey) => {
  if (!apiCache.has(cacheKey)) return null;
  
  const cachedData = apiCache.get(cacheKey);
  const now = Date.now();
  
  // Periksa apakah cache masih valid
  if (now - cachedData.timestamp > CACHE_DURATION) {
    apiCache.delete(cacheKey);
    return null;
  }
  
  return cachedData.data;
};

// Fungsi untuk menyimpan data ke cache
const saveToCache = (cacheKey, data) => {
  apiCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

// Fungsi untuk menghapus cache berdasarkan kunci
const invalidateCache = (cacheKey) => {
  if (cacheKey) {
    apiCache.delete(cacheKey);
  } else {
    apiCache.clear(); // Hapus semua cache jika tidak ada kunci yang ditentukan
  }
};

// Ekspos fungsi untuk menghapus cache
apiClient.invalidateCache = invalidateCache;

// Interceptor untuk request
apiClient.interceptors.request.use(
  (config) => {
    // Tambahkan header otorisasi jika ada token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Periksa cache untuk request GET
    if (isCacheable(config)) {
      const cacheKey = getCacheKey(config);
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        console.log('Menggunakan data dari cache untuk:', config.url);
        // Mengembalikan promise yang sudah resolved dengan data dari cache
        return {
          ...config,
          adapter: () => {
            return Promise.resolve({
              data: cachedData,
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
              request: {}
            });
          }
        };
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variabel untuk melacak percobaan retry
const retryQueue = new Map();

// Interceptor untuk response
apiClient.interceptors.response.use(
  (response) => {
    // Simpan response ke cache jika bisa di-cache
    if (isCacheable(response.config)) {
      const cacheKey = getCacheKey(response.config);
      saveToCache(cacheKey, response.data);
    }
    return response;
  },
  async (error) => {
    const { config } = error;
    
    // Jika tidak ada config, tidak bisa retry
    if (!config) {
      return Promise.reject(error);
    }
    
    // Tangani error response (misalnya 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access, redirecting to login');
      // window.location.href = '/';
      return Promise.reject(error);
    }
    
    // Tangani rate limit error (status 429 Too Many Requests)
    if (error.response && (error.response.status === 429 || error.message.includes('rate limit'))) {
      // Dapatkan atau inisialisasi retry count untuk request ini
      const requestId = getCacheKey(config);
      const retryCount = retryQueue.get(requestId) || 0;
      
      // Maksimal 3 kali retry
      if (retryCount < 3) {
        // Tambah retry count
        retryQueue.set(requestId, retryCount + 1);
        
        // Hitung waktu delay dengan exponential backoff
        const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        console.warn(`Rate limit terlampaui. Mencoba lagi dalam ${delay}ms (percobaan ke-${retryCount + 1})`);
        
        // Tampilkan pesan ke pengguna
        if (typeof window !== 'undefined') {
          // Bisa diganti dengan toast notification atau UI lainnya
          console.info('Terlalu banyak permintaan ke server. Mohon tunggu sebentar...');
        }
        
        // Tunggu sebelum mencoba lagi
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Coba lagi request
        return apiClient(config);
      } else {
        // Hapus dari queue setelah mencapai batas retry
        retryQueue.delete(requestId);
        
        // Modifikasi pesan error untuk lebih informatif
        error.message = 'Batas permintaan ke server terlampaui. Silakan coba lagi nanti.';
        console.error('Batas retry terlampaui:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;