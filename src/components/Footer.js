// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} Crypto Dashboard. CoinGecko Free API, Rate Limits Apply
      </div>
    </footer>
  );
};

export default Footer;
