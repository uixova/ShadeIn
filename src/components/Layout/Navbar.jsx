import React from 'react';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">ShadeIn</div>
      
      <div className="search-bar">
        <i className="ti ti-search"></i>
        <input type="text" placeholder="Ara..." />
      </div>

      <div className="button-area">
        <button className="btn login-btn">Giriş</button>
        <button className="btn signup-btn">Kaydol</button>
      </div>
    </nav>
  );
};

export default Navbar;