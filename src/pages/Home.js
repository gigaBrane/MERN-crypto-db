// src/pages/Home.js
import React from 'react';
import NewsCarousel from '../components/NewsCarousel'; 


const Home = () => {
    return (
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold">Welcome to Crypto Dashboard</h1>
        <p className="text-lg mt-4">Track and manage your cryptocurrency investments.</p>
  
        {/* Add the News Carousel */}
        <div className="mt-10">
          <NewsCarousel />
        </div>
      </div>
    );
  };

export default Home;
