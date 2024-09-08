// src/components/Header.js
import React, { useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton'; 

const Header = () => {
  const { user } = useContext(GlobalStateContext);

  return (
    <header className="bg-blue-500 text-white p-2"> {/* Reduced padding to p-2 */}
      <nav className="container mx-auto flex justify-between items-center relative">
        <h1 className="text-xl font-bold">Crypto Dashboard</h1>

        {/* Centered Welcome Text */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-center">Welcome, {user ? user.name : 'Guest'}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/cryptos" className="mr-4">Cryptos</Link>
          <Link to="/portfolio" className="mr-4">Portfolio</Link>

          {/* Show LogoutButton only when user is logged in */}
          {user ? <LogoutButton /> : (
            <Link
              to="/login"
              className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-100 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
