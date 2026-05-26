import React, { useState, useEffect } from 'react';
import { Search, Star, StarOff, Filter, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import { useCryptoSocket } from './hooks/useCryptoSocket';

interface Currency {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  isFavorite: boolean;
}

const SpotMarkets = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('USDT');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Currency; direction: 'asc' | 'desc' } | null>(null);
  
  const navigate = useNavigate();
  const { prices, isConnected } = useCryptoSocket();

  useEffect(() => {
    const fetchSpotTickers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/market/spotdata`);
        const tickers = res.data;

        if (!Array.isArray(tickers)) throw new Error('Unexpected ticker format');

        const spotTickers = tickers.filter(item =>
          item.symbol.includes('-') &&
          !item.symbol.includes('M') &&
          !item.symbol.includes('SWAP')
        );

        const formatted = spotTickers.map(item => ({
          symbol: item.symbol,
          name: item.symbol.split('-')[0],
          price: parseFloat(item.last),
          change24h: parseFloat(item.changeRate) * 100,
          volume24h: parseFloat(item.volValue),
          marketCap: 0,
          isFavorite: false,
        }));

        setCurrencies(formatted);
      } catch (error) {
        console.error('Error fetching spot tickers:', error);
        toast.error('Failed to load spot market data');
      } finally {
        setLoading(false);
      }
    };

    fetchSpotTickers();
  }, []);

  // Update prices from WebSocket data
  useEffect(() => {
    if (prices && Object.keys(prices).length > 0) {
      setCurrencies(prev =>
        prev.map(currency => {
          const symbol = currency.symbol.replace('-', '');
          if (prices[symbol]) {
            return {
              ...currency,
              price: prices[symbol].price,
              change24h: prices[symbol].change || currency.change24h
            };
          }
          return currency;
        })
      );
    }
  }, [prices]);

  // Filter currencies
  useEffect(() => {
    let result = currencies.filter(currency =>
      !currency.symbol.includes('SWAP') &&
      !currency.symbol.includes('M') &&
      currency.symbol.includes('-') &&
      currency.symbol.endsWith(`-${filterType}`)
    );

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        currency =>
          currency.symbol.toLowerCase().includes(term) ||
          currency.name.toLowerCase().includes(term)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCurrencies(result);
  }, [currencies, filterType, searchTerm, sortConfig]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFavorite = (symbol: string) => {
    setCurrencies(prev =>
      prev.map(currency =>
        currency.symbol === symbol
          ? { ...currency, isFavorite: !currency.isFavorite }
          : currency
      )
    );
  };

  const handleSort = (key: keyof Currency) => {
    let direction: 'asc' | 'desc' = 'desc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }

    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Currency) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <Filter size={14} className="ml-1 text-gray-400" />;
    }

    return sortConfig.direction === 'asc'
      ? <ArrowUp size={14} className="ml-1 text-primary-500" />
      : <ArrowDown size={14} className="ml-1 text-primary-500" />;
  };

  if (loading) {
    return <Loader fullScreen text="Loading spot markets..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spot Markets</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-white dark:bg-dark-300 rounded-lg shadow">
        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {isConnected ? 'Live data connected' : 'Live data disconnected'}
        </p>
      </div>

      {/* Filter Type Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['USDT', 'USDC', 'BTC', 'ETH'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`
              inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm
              transition-all duration-200 transform hover:scale-105
              ${filterType === type
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-dark-200 text-gray-700 dark:text-gray-300 opacity-70 hover:opacity-100'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-300 rounded-lg shadow mb-6">
        <div className="relative p-4">
          <Search size={18} className="absolute left-6 top-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search spot markets..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-300 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Spot Market Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCurrencies.length > 0 ? (
          filteredCurrencies.map((currency, index) => (
            <div
              key={index}
              className="border rounded-lg bg-white dark:bg-dark-300 p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currency.symbol}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currency.name}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(currency.symbol)}
                  className="text-yellow-400 hover:text-yellow-500"
                >
                  {currency.isFavorite ? (
                    <Star size={18} className="fill-yellow-400" />
                  ) : (
                    <StarOff size={18} />
                  )}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${currency.price.toFixed(4)}
                </p>
                <p
                  className={`text-sm mt-1 font-medium ${
                    currency.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {currency.change24h.toFixed(2)}%
                </p>
              </div>

              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                24h Volume: {currency.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
            No spot markets found
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotMarkets;
