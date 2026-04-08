import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Loader from './components/Common/Loader';
import './styles/style.css'

// Layout & Features
import Navbar from './components/Layout/Navbar';
import Home from './feautures/home/Home';
import Detail from './feautures/detail/Detail';
import Landing from './feautures/landing/Landing'; 
import Auth from './feautures/auth/Auth'; // Yeni ekledik

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      {isAuthenticated && (
        <>
          <Navbar />
          <div className="navbar-mask" aria-hidden="true"></div>
        </>
      )}

      {/* isAuthenticated değilse 'landing-container' basılıyor, custom scrollbar orada çalışacak */}
      <div className={isAuthenticated ? "content-container" : "landing-container"}>
        <Routes>
          {/* Landing Sayfası */}
          <Route 
            path="/" 
            element={!isAuthenticated ? <Landing /> : <Navigate to="/home" />} 
          />

          {/* Auth Sayfaları (Login & Signup) */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Auth mode="login" /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <Auth mode="signup" /> : <Navigate to="/home" />} 
          />

          {/* Korumalı Rotalar */}
          <Route 
            path="/home" 
            element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/detail/:id" 
            element={isAuthenticated ? <Detail /> : <Navigate to="/" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {isAuthenticated && <div style={{ height: '50px' }}></div>}
      </div>
    </div>
  );
}

export default App;