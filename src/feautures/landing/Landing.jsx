import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchFaqsApi } from './services/landingServices';

// Bileşenleri İçeri Alıyoruz
import Hero from './components/Hero';
import Features from './components/Features';
import FAQ from './components/FAQ';

import './css/Landing.css';

const Landing = () => {
  const [faqs, setFaqs] = useState([]);
  const faqSectionRef = useRef(null);

  useEffect(() => {
    const getFaqs = async () => {
      const data = await fetchFaqsApi();
      setFaqs(data);
    };
    getFaqs();
    
    // SEO ve Scroll Fix
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
  }, []);

  const scrollToFaq = (e) => {
    e.preventDefault();
    faqSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-wrapper">
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <header className="landing-header">
        <div className="landing-logo">
          <div className="logo-icon"><i className="ti ti-ghost"></i></div>
          <span>ShadeIn</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="nav-link">Giriş Yap</Link>
          <Link to="/signup" className="nav-btn-primary">Karanlığa Katıl</Link>
        </div>
      </header>

      <main className="landing-content">
        <Hero onScrollToFaq={scrollToFaq} />
        <Features />
        <FAQ faqs={faqs} forwardRef={faqSectionRef} />
      </main>

      <footer className="landing-footer">
        <p>&copy; 2026 ShadeIn. Gölgelerin fısıltı noktası.</p>
      </footer>
    </div>
  );
};

export default Landing;