import axios from 'axios';

// Base API URLs
const API_BASE_URL = 'https://api.coingecko.com/api/v3'; // Direct call to CoinGecko for efficiency
const PORTFOLIO_API_URL = 'http://localhost:5000/api/portfolio';

// Get JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('token'); // Assuming you store the token in localStorage after login
};

// Create an Axios instance for authenticated requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add Authorization header to each request if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch data for the top 100 cryptocurrencies
export const fetchTopCryptos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    throw error;
  }
};

// Fetch details for a specific cryptocurrency
export const fetchCryptoDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${id}:`, error);
    throw error;
  }
};

// Fetch user's portfolio
export const fetchPortfolio = async () => {
  try {
    const response = await axiosInstance.get(`${PORTFOLIO_API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

// Add cryptocurrency to user's portfolio
export const addToPortfolio = async (cryptoData) => {
  try {
    const response = await axiosInstance.post(`${PORTFOLIO_API_URL}/add`, cryptoData);
    return response.data;
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    throw error;
  }
};

