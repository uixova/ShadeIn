import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/style.css'
import Navbar from './components/Layout/Navbar'
import Home from './feautures/home/Home'
import Detail from './feautures/detail/Detail';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="navbar-mask" aria-hidden="true"></div>

      <div className="content-container">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/detail/:id' element={<Detail />} />
        </Routes>
        <div style={{ height: '50px' }}></div>
      </div>
    </div>
  )
}

export default App
