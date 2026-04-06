import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Hero.css';

const Hero = ({ onScrollToFaq }) => {
  return (
    <section className="hero-section">
      <div className="hero-badge">Shadow-Based Anonymous Network</div>
      <h1 className="hero-title">
        İçindeki Gölgeyi <br /> 
        <span className="text-gradient">Özgür Bırak</span>
      </h1>
      <p className="hero-description">
        Kimliğini gizle, fısıltını bırak. ShadeIn'de her itiraf bir gölge gibidir; 
        gerçektir ama asla yakalanamaz. Dijital iz bırakmadan özgürce konuş.
      </p>
      <div className="hero-btns">
        <Link to="/signup" className="btn-main">İtiraf Etmeye Başla</Link>
        <button onClick={onScrollToFaq} className="btn-secondary-link">
          Nasıl Çalışır? <i className="ti ti-arrow-down"></i>
        </button>
      </div>
    </section>
  );
};

export default Hero;