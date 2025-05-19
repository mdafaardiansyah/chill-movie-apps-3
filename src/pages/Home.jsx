import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import MovieCarousel from '../components/home/MovieCarousel';

// Import API service dan custom hooks
import movieService from '../services/api/movieService';
import { useApi } from '../hooks/useApi';


const Home = () => {
  // Menggunakan custom hook untuk mengambil data film
  const { data: watchingMovies, loading: loadingWatching, error: errorWatching } = useApi(movieService.getAllMovies);
  const { data: topRatingMovies, loading: loadingTopRated, error: errorTopRated } = useApi(movieService.getTopRatedMovies);
  const { data: trendingMovies, loading: loadingTrending, error: errorTrending } = useApi(movieService.getTrendingMovies);
  
  // State untuk menampilkan pesan loading atau error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Memperbarui state loading dan error berdasarkan status semua permintaan API
  useEffect(() => {
    setIsLoading(loadingWatching || loadingTopRated || loadingTrending);
    
    // Mengumpulkan semua pesan error jika ada
    const errors = [];
    if (errorWatching) errors.push(errorWatching);
    if (errorTopRated) errors.push(errorTopRated);
    if (errorTrending) errors.push(errorTrending);
    
    setError(errors.length > 0 ? errors.join(', ') : null);
  }, [loadingWatching, loadingTopRated, loadingTrending, errorWatching, errorTopRated, errorTrending]);

  // Fungsi untuk mencoba memuat ulang data
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    // Memanggil refresh pada semua API
    Promise.all([
      watchingMovies?.refresh?.(),
      topRatingMovies?.refresh?.(),
      trendingMovies?.refresh?.()
    ]).catch(err => {
      console.error('Error retrying data fetch:', err);
    });
  };

  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <Hero />
        {isLoading ? (
          <div className="loading-container" style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Memuat data film...</p>
            <div className="loading-spinner" style={{ margin: '20px auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div className="error-container" style={{ textAlign: 'center', padding: '50px 0', color: '#e74c3c' }}>
            <p style={{ fontSize: '18px', marginBottom: '15px' }}>Terjadi kesalahan saat memuat data:</p>
            <p style={{ marginBottom: '20px', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', display: 'inline-block' }}>{error}</p>
            <button 
              onClick={handleRetry}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            <MovieCarousel 
              title="Melanjutkan Tonton Film" 
              type="landscape" 
              movies={watchingMovies || []} 
            />

            <MovieCarousel 
              title="Top Rating Film dan Series Hari ini" 
              type="portrait" 
              movies={topRatingMovies || []} 
            />
            <MovieCarousel 
              title="Film Trending" 
              type="portrait" 
              movies={trendingMovies || []} 
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;