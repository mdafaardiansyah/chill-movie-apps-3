import React, { useState, useEffect } from 'react';
import heroBackground from '../../assets/images/hero/duty-after-school.png';
import infoIcon from '../../assets/images/icons/information-outline.png';
import volumeIcon from '../../assets/images/icons/volume-off.png';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="hero" style={{ 
      backgroundImage: `url(${heroBackground})`,
      backgroundSize: isMobile ? '160% auto' : 'cover',
      backgroundPosition: isMobile ? '65% center' : 'center'
    }}>
      <div className="container">
        <div className="hero-content">
          <h1>Duty After School</h1>
          <p>
            Sebuah benda tak dikenal mengambil alih dunia. Dalam keputusasaan, Departemen Pertahanan mulai merekrut lebih banyak tentara, 
            termasuk siswa sekolah menengah. Mereka pun segera menjadi pejuang garis depan dalam perang.
          </p>
          <div className="hero-buttons">
            <button className="btn-third">Mulai</button>
            <button className="btn btn-secondary">
              <img src={infoIcon} alt="Info" />
              Selengkapnya
            </button>
            <span className="age-rating">18+</span>
          </div>
        </div>
        <div className="hero-controls">
          <button className="btn-audio">
            <img src={volumeIcon} alt="Volume" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;