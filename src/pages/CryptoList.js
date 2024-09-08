import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalStateContext, GlobalDispatchContext } from '../context/GlobalStateContext';
import { fetchTopCryptos } from '../services/api'; // Import the API function

const CryptoList = () => {
  const { cryptos } = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  useEffect(() => {
    const getCryptos = async () => {
      try {
        const data = await fetchTopCryptos();
        dispatch({ type: 'SET_CRYPTOS', payload: data.slice(0, 33) }); 
      } catch (error) {
        console.error('Failed to fetch cryptos:', error);
      }
    };

    if (cryptos.length === 0) {
      getCryptos();
    }
  }, [dispatch, cryptos.length]);

  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>24h %</th>
            <th>Market Cap</th>
            <th>Volume(24h)</th>
            <th>Circulating Supply</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto, index) => (
            <tr key={crypto.id} className="hover:bg-gray-100">
              <td>{index + 1}</td>
              <td>
                <Link to={`/crypto/${crypto.id}`} className="flex items-center">
                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
                  <span className="font-semibold">{crypto.name}</span>
                  <span className="text-gray-500 ml-2">{crypto.symbol.toUpperCase()}</span>
                </Link>
              </td>
              <td>${crypto.current_price.toLocaleString()}</td>
              <td className={crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                {crypto.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td>${crypto.market_cap.toLocaleString()}</td>
              <td>${crypto.total_volume.toLocaleString()}</td>
              <td>{crypto.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoList;
