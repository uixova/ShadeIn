import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/style.css'
import Navbar from './components/Layout/Navbar'
import Home from './feautures/home/Home'
import Detail from './feautures/detail/Detail';

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/detail/:id' element={<Detail />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
