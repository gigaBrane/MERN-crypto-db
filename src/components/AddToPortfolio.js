import React, { useState } from 'react';
import { addToPortfolio } from '../services/api';

const AddToPortfolio = () => {
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState(0);
  const [boughtAt, setBoughtAt] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cryptoData = { coinId, amount, boughtAt, currentPrice };

    try {
      await addToPortfolio(cryptoData);
      setMessage('Added to portfolio!');
    } catch (err) {
      setMessage('Failed to add cryptocurrency.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Coin ID"
        value={coinId}
        onChange={(e) => setCoinId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Bought At"
        value={boughtAt}
        onChange={(e) => setBoughtAt(e.target.value)}
      />
      <input
        type="number"
        placeholder="Current Price"
        value={currentPrice}
        onChange={(e) => setCurrentPrice(e.target.value)}
      />
      <button type="submit">Add to Portfolio</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddToPortfolio;
