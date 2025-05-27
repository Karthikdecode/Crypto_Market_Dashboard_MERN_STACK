import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Ticker {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

const TopLosers = () => {
  const [topLosers, setTopLosers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTopLosers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/market/top-losers?t=${Date.now()}`);
        setTopLosers(response.data.topLosers);
      } catch (err) {
        console.error('Error fetching top losers:', err);
        setError('Failed to fetch top losers');
      } finally {
        setLoading(false);
      }
    };

    fetchTopLosers();
    const interval = setInterval(fetchTopLosers, 100000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Top Losers</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Symbol</th>
            <th className="p-2 text-right">Price (USDT)</th>
            <th className="p-2 text-right">24h Change</th>
            <th className="p-2 text-right">24h Volume</th>
          </tr>
        </thead>
        <tbody>
          {topLosers.map((coin) => (
            <tr key={coin.symbol} className="border-b hover:bg-gray-50">
              <td className="p-2 font-medium">{coin.symbol}</td>
              <td className="p-2 text-right">{coin.price.toFixed(4)}</td>
              <td
                className={`p-2 text-right font-semibold ${
                  coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {coin.change24h.toFixed(2)}%
              </td>
              <td className="p-2 text-right">{coin.volume24h.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopLosers;
