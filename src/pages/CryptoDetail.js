import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCryptoDetails, addToPortfolio } from '../services/api';
import { GlobalStateContext, GlobalDispatchContext } from '../context/GlobalStateContext';

const CryptoDetail = () => {
  const { id } = useParams();
  const { selectedCrypto, user } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);
  const [historicalData, setHistoricalData] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const source = axios.CancelToken.source();

    const getCryptoDetails = async () => {
      try {
        const data = await fetchCryptoDetails(id);
        dispatch({ type: 'SET_SELECTED_CRYPTO', payload: data });

        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
          params: { vs_currency: 'usd', days: 7 },
          cancelToken: source.token,
        });

        const formattedData = response.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price,
        }));

        setHistoricalData(formattedData);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Failed to fetch crypto details:', error);
          setError('Failed to load data');
        }
        setLoading(false);
      }
    };

    getCryptoDetails();
    return () => {
      source.cancel('Request canceled due to component unmount.');
    };
  }, [id, dispatch]);

  const handleAddToPortfolio = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setSuccessMessage('Please enter a valid amount.');
      return;
    }

    try {
      const portfolioData = {
        coinId: selectedCrypto.symbol, // Use the id from the route params
        amount: parseFloat(amount), // User input amount
        boughtAt: selectedCrypto.market_data.current_price.usd, // The price when bought
        currentPrice: selectedCrypto.market_data.current_price.usd, // The current price
      };

      await addToPortfolio(portfolioData);
      setSuccessMessage('Added to portfolio successfully'); // Show success message
    } catch (error) {
      console.error('Failed to add to portfolio:', error);
      setSuccessMessage('Failed to add to portfolio'); // Show failure message
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!selectedCrypto || error) {
    return <div className="text-center text-red-500">Data not available</div>;
  }

  const prices = historicalData.map(data => data.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const buffer = (maxPrice - minPrice) * 0.05;
  const bufferedMinPrice = minPrice - buffer;
  const bufferedMaxPrice = maxPrice + buffer;

  const formatPrice = (price) => price > 1000 ? `$${(price / 1000).toFixed(1)}k` : `$${price.toLocaleString()}`;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Crypto Details */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800">
              {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})
            </h1>
            <p className="text-3xl text-blue-600 font-semibold mt-2">
              ${selectedCrypto.market_data.current_price.usd.toLocaleString()}
            </p>
            <p className={`text-xl mt-2 ${selectedCrypto.market_data.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {selectedCrypto.market_data.price_change_percentage_24h?.toFixed(2)}% (24h)
            </p>
          </div>
          <img
            src={selectedCrypto.image.large}
            alt={selectedCrypto.name}
            className="w-24 h-24 rounded-full shadow-md"
          />
        </div>

        {/* Add to Portfolio Widget */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          {user ? (
            <>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Add to Portfolio</h3>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-600">Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleAddToPortfolio}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
              >
                Add to Portfolio
              </button>
              {/* Success Message */}
              {successMessage && (
                <p className="mt-4 text-center text-sm font-semibold text-blue-600">
                  {successMessage}
                </p>
              )}
            </>
          ) : (
            <button
              onClick={redirectToLogin}
              className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-all"
            >
              Log in to add to portfolio
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-gray-600">Market Cap</p>
          <p className="text-xl font-bold text-gray-800">${selectedCrypto.market_data.market_cap.usd.toLocaleString()}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-gray-600">Volume (24h)</p>
          <p className="text-xl font-bold text-gray-800">${selectedCrypto.market_data.total_volume.usd.toLocaleString()}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-gray-600">Circulating Supply</p>
          <p className="text-xl font-bold text-gray-800">{selectedCrypto.market_data.circulating_supply.toLocaleString()} {selectedCrypto.symbol.toUpperCase()}</p>
        </div>
      </div>

      {/* Graph */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Price Trend (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData}>
            <XAxis dataKey="date" />
            <YAxis width={80} domain={[bufferedMinPrice, bufferedMaxPrice]} tickFormatter={formatPrice} />
            <Tooltip formatter={(value) => formatPrice(value)} />
            <Line type="monotone" dataKey="price" stroke="#4A90E2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoDetail;
