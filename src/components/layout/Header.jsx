import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import assets
import logoImage from '../../assets/images/logo/Logo.png';
import avatarImage from '../../assets/images/hero/Avatar.png';
import arrowDownIcon from '../../assets/images/icons/KeyboardArrowDown.png';
import accountIcon from '../../assets/images/icons/account.png';
import starIcon from '../../assets/images/icons/star.png';
import logoutIcon from '../../assets/images/icons/logout-variant.png';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleLogout = () => {
    // Implementasi logout - dalam aplikasi nyata, hanya akan menghapus token, state user, dll.
    // Untuk contoh sederhana ini, hanya navigasi ke halaman login
    navigate('/');
    setIsDropdownOpen(false);
  };
  
  // Menutup dropdown ketika klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo-nav">
          <Link to="/home" className="logo">
            <img src={logoImage} alt="Chill Logo" />
          </Link>
          <nav className="main-nav">
            <ul>
              <li><Link to="#">Series</Link></li>
              <li><Link to="#">Film</Link></li>
              <li><Link to="/mylist">Daftar Saya</Link></li>
            </ul>
          </nav>
        </div>

        <div className="user-profile" ref={dropdownRef}>
          <div onClick={toggleDropdown} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src={avatarImage} alt="Profile" className="avatar" />
            <img 
              src={arrowDownIcon} 
              alt="Dropdown" 
              className={`arrow-down ${isDropdownOpen ? 'rotate' : ''}`}
              style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
            />
          </div>
          {isDropdownOpen && (
            <div className="dropdown-content" style={{
              position: 'absolute',
              top: '60px',
              right: '0',
              backgroundColor: '#1F1D2B',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              zIndex: 100,
              minWidth: '200px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <Link to="#" className="dropdown-item" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                color: 'white',
                textDecoration: 'none',
                gap: '10px'
              }}>
                <img src={accountIcon} alt="Profile" />
                <span>Profil Saya</span>
              </Link>
              <Link to="#" className="dropdown-item" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                color: 'white',
                textDecoration: 'none',
                gap: '10px'
              }}>
                <img src={starIcon} alt="Premium" />
                <span>Ubah Premium</span>
              </Link>
              <Link to="/admin" className="dropdown-item" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                color: 'white',
                textDecoration: 'none',
                gap: '10px'
              }}>
                <img src={starIcon} alt="Admin" />
                <span>Admin Panel</span>
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout-button" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                color: 'white',
                background: 'none',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                gap: '10px'
              }}>
                <img src={logoutIcon} alt="Logout" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;