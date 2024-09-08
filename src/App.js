import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Layout from './components/Layout';
import Home from './pages/Home';
import CryptoList from './pages/CryptoList';
import CryptoDetail from './pages/CryptoDetail';
import LoginPage from './pages/LoginPage';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cryptos" element={<CryptoList />} />
          <Route path="/crypto/:id" element={<CryptoDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
