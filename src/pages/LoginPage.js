// src/pages/Home.js
import React from 'react';
import Login from '../components/Login';

const LoginPage = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold">Sign in to Crypto Dashboard</h1>
      <p className="text-lg mt-4">Track and manage your cryptocurrency investments.</p>
      <Login /> 
    </div>
  );
};

export default LoginPage;
