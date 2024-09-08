import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalDispatchContext } from '../context/GlobalStateContext';

const Login = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For sign up
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle Forgot Password
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      dispatch({ type: 'SET_USER', payload: { user: JSON.parse(storedUser), token: storedToken } });
    }
  }, [dispatch]);

  // Handle login
  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
        const { token, user } = response.data;

        dispatch({ type: 'SET_USER', payload: { user, token } });
        localStorage.setItem('token', token); // Save token for authenticated requests
        localStorage.setItem('user', JSON.stringify(user)); // Save user data
        setError('');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Login failed: ${error.response.data.message}`);
        } else {
          setError('Login failed: Something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter both email and password.');
    }
  };

  // Handle sign up
  const handleSignUp = async () => {
    if (name && email && password) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
        const { token, user } = response.data;

        dispatch({ type: 'SET_USER', payload: { user, token } });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Save user data
        setError('');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(`Sign up failed: ${error.response.data.message}`);
        } else {
          setError('Sign up failed: Something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Create Account' : 'Login'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Name field only for Sign Up */}
      {isSignUp && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Toggle between Login and Sign Up */}
      {!isSignUp ? (
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      ) : (
        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      )}

      {/* Forgot Password Section */}
      {!isSignUp && (
        <div className="mt-4">
          <button
            onClick={() => setShowForgotPassword(!showForgotPassword)}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
          {showForgotPassword && <p className="text-gray-500 mt-2">Unlucky, make a new account!</p>}
        </div>
      )}

      {/* Switch between Login and Sign Up */}
      <div className="mt-4">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
};

export default Login;
