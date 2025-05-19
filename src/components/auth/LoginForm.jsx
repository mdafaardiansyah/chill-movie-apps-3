import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Auth context will be used in future implementation

// Import assets
import logoImage from '../../assets/images/logo/Logo.png';
import googleIcon from '../../assets/images/icons/google.png';
import { loginBackground } from '../../styles/auth-backgrounds';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementasi login akan ditambahkan di sini
    // Untuk saat ini hanya melakukan navigasi ke halaman home
    window.location.href = '/home';
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${loginBackground})` }}>
      <div className="auth-card">
        {/* Logo */}
        <div className="logo-container">
          <img src={logoImage} alt="Chill Logo" className="logo" />
        </div>

        {/* Form Header */}
        <h1 className="auth-title">Masuk</h1>
        <p className="auth-subtitle">Selamat datang kembali!</p>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Masukkan username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <div className="password-input-container">
              <input 
                type="password" 
                id="password" 
                placeholder="Masukkan kata sandi" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Links */}
          <div className="auth-links">
            <div className="register-link">
              Belum punya akun? <Link to="/register">Daftar</Link>
            </div>
            <div className="forgot-password">
              <Link to="#">Lupa kata sandi?</Link>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn-primary">Masuk</button>

          {/* Or Divider */}
          <div className="divider">
            <span>Atau</span>
          </div>

          {/* Google Sign In */}
          <button type="button" className="btn-google">
            <img src={googleIcon} alt="Google" className="google-icon" />
            Masuk dengan Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;