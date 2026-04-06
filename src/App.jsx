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

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Backend/JSON verisi çekilirken bekle
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      {/* Navbar sadece giriş yapmış kullanıcıya veya belirli sayfalarda gözüksün */}
      {isAuthenticated && (
        <>
          <Navbar />
          <div className="navbar-mask" aria-hidden="true"></div>
        </>
      )}

      <div className={isAuthenticated ? "content-container" : "landing-container"}>
        <Routes>
          {/* Herkese Açık / Vitrin Rotası */}
          <Route 
            path="/" 
            element={!isAuthenticated ? <Landing /> : <Navigate to="/home" />} 
          />

          {/* Korumalı Rotalar (Sadece Auth ise) */}
          <Route 
            path="/home" 
            element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/detail/:id" 
            element={isAuthenticated ? <Detail /> : <Navigate to="/" />} 
          />

          {/* Bilinmeyen yolları ana sayfaya at */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {isAuthenticated && <div style={{ height: '50px' }}></div>}
      </div>
    </div>
  );
}

export default App;