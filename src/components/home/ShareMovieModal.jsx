import React, { useState } from 'react';

const ShareMovieModal = ({ movie, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [shareStatus, setShareStatus] = useState(null);

  // Handler untuk mengirim film ke teman
  const handleShareMovie = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('Email teman tidak boleh kosong!');
      return;
    }

    // Simulasi pengiriman berbagi film
    setTimeout(() => {
      setShareStatus('success');
      // Reset form setelah berhasil
      setEmail('');
      setMessage('');
      
      // Tutup notifikasi sukses setelah 3 detik
      setTimeout(() => {
        setShareStatus(null);
        onClose();
      }, 3000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#1F1D2B',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        position: 'relative',
        padding: '20px'
      }}>
        <button 
          className="close-modal" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
        
        <h2 style={{ marginBottom: '20px' }}>Bagikan "{movie?.title}" ke Teman</h2>
        
        {shareStatus === 'success' ? (
          <div className="success-message" style={{ 
            padding: '15px', 
            backgroundColor: 'rgba(76, 175, 80, 0.2)', 
            borderRadius: '4px',
            marginBottom: '15px',
            color: '#4CAF50',
            textAlign: 'center'
          }}>
            <p>Film berhasil dibagikan ke {email}!</p>
          </div>
        ) : (
          <form onSubmit={handleShareMovie} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="email">Email Teman</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#2B2A3A', border: '1px solid #3A3950', color: 'white' }}
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="message">Pesan (Opsional)</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan untuk temanmu..."
                rows="4"
                style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#2B2A3A', border: '1px solid #3A3950', color: 'white', resize: 'vertical' }}
              />
            </div>
            
            <div className="movie-preview" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              padding: '10px', 
              backgroundColor: '#2B2A3A', 
              borderRadius: '4px' 
            }}>
              {movie?.poster && (
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  style={{ width: '60px', height: 'auto', borderRadius: '4px' }} 
                />
              )}
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{movie?.title}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#8E8E8E' }}>
                  Rating: {movie?.rating}/5
                </p>
              </div>
            </div>
            
            <button 
              type="submit" 
              style={{ 
                backgroundColor: '#5142FC', 
                color: 'white', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginTop: '10px',
                fontWeight: 'bold'
              }}
            >
              Bagikan Film
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShareMovieModal;