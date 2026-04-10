import React, { useState } from 'react';
import UserModal from '../Feed/UserModal'; 
import '../css/Navbar.css';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => window.location.href = '/'}>ShadeIn</div>

      <div className="user-section">
        {/* Sadece giriş yapmış kullanıcı görecek */}
        <div 
          className={`profile-circle ${isModalOpen ? 'active' : ''}`} 
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <i className="ti ti-user-bolt"></i>
        </div>

        {/* Dropdown Modal */}
        {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;