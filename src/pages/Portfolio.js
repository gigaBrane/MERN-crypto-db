import React, { useEffect, useState } from 'react';
import { fetchPortfolio } from '../services/api';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPortfolio = async () => {
      try {
        const data = await fetchPortfolio();
        setPortfolio(data);
      } catch (err) {
        setError('Login to view Portfolio');
      } finally {
        setLoading(false);
      }
    };
    getPortfolio();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Calculate total value and PnL
  const totalValue = portfolio.cryptocurrencies.reduce((acc, crypto) => acc + (crypto.amount * crypto.currentPrice), 0);
  const totalPnL = portfolio.cryptocurrencies.reduce((acc, crypto) => acc + (crypto.amount * (crypto.currentPrice - crypto.boughtAt)), 0);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Portfolio</h1>

      {portfolio && portfolio.cryptocurrencies.length > 0 ? (
        <div>
          <ul className="divide-y divide-gray-200">
            {portfolio.cryptocurrencies.map((crypto, index) => (
              <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow mb-4">
                <div className="flex items-center">
                  
                  <div>
                    <p className="text-xl font-semibold text-gray-700">{crypto.coinId.toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{crypto.amount} @ ${crypto.boughtAt.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-gray-800">Current Price: ${crypto.currentPrice.toLocaleString()}</p>
                  <p
                    className={`text-sm ${crypto.currentPrice > crypto.boughtAt ? 'text-green-500' : 'text-red-500'}`}
                  >
                    PnL: ${(crypto.amount * (crypto.currentPrice - crypto.boughtAt)).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Display total and PnL */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-xl font-semibold text-gray-700">Total Portfolio Value: ${totalValue.toLocaleString()}</p>
            <p
              className={`text-xl font-semibold ${
                totalPnL > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              Total PnL: ${totalPnL.toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No cryptocurrencies in your portfolio yet.</p>
      )}
    </div>
  );
};

export default Portfolio;
