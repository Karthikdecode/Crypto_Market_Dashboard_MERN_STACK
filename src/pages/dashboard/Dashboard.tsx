import React, { useState, useEffect } from 'react';
import { Search, Star, StarOff, TrendingUp, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import axios from 'axios';

import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import CurrencyPair from './components/CurrencyPair';
import DashboardTabs from './components/DashboardTabs';
import MarketStats from './components/MarketStats';
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'all' | 'spot' >('overview');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('USDT');
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Currency; direction: 'asc' | 'desc' } | null>(null);
  
  // Get real-time data from WebSocket
  const { prices, isConnected } = useCryptoSocket();
 useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/currencies'); 
        const data = await response.json();

        if (data.currencies) {
          setCurrencies(data.currencies);
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
  if (activeTab === 'Announcements') {
    axios.get('http://localhost:5000/api/v3/market/announcements')
      .then(res => {
        setAnnouncements(res.data.announcements);  
      })
      .catch(err => {
        toast.error('Failed to load announcements');
        console.error(err);
      });
  }
}, [activeTab]);

//all tab:
useEffect(() => {
  const fetchAllTickers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/v1/market/allTickers');

      const tickers = res?.data?.data?.ticker;
      if (!Array.isArray(tickers)) {
        throw new Error("Ticker data is not an array");
      }

      const formatted = [];

      for (const item of tickers) {
        try {
          const last = parseFloat(item.last);
          const changeRate = parseFloat(item.changeRate);
          const volValue = parseFloat(item.volValue);

          if (!item.symbol || isNaN(last) || isNaN(changeRate) || isNaN(volValue)) {
            console.warn("Skipping malformed ticker:", item);
            continue;
          }

          formatted.push({
            symbol: item.symbol,
            name: item.symbol.split('-')[0],
            price: last,
            change24h: changeRate * 100,
            volume24h: volValue,
            marketCap: 0,
            isFavorite: false,
          });
        } catch (mapError) {
          console.error("Error mapping ticker item:", item, mapError);
        }
      }

      setCurrencies(formatted);
    } catch (err) {
      console.error("Error in fetchAllTickers:", err); // only show toast if nothing succeeded
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 'all') {
    fetchAllTickers();
  }
}, [activeTab]);



// Spot tab: fetch live spot market data from KuCoin
useEffect(() => {
  const fetchSpotTickers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/v1/market/spotdata');
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

  if (activeTab === 'spot') {
    fetchSpotTickers();
  }
}, [activeTab]);


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

  

  // Filter currencies based on active tab and search term
  useEffect(() => {
    let result = [...currencies];
    
    // Apply tab filtering
    if (activeTab === 'favorites') {
      result = result.filter(currency => currency.isFavorite);
    } else if (activeTab === 'spot') {
  result = result.filter(currency =>
    !currency.symbol.includes('SWAP') && // exclude perpetual contracts
    !currency.symbol.includes('M') &&    // exclude margin/futures symbols like BTC-USDTM
    currency.symbol.includes('-')        // keep only base-quote format like BTC-USDT
  );
}

    
    // Apply search filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        currency => 
          currency.symbol.toLowerCase().includes(term) || 
          currency.name.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
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
  }, [currencies, activeTab, searchTerm, sortConfig]);

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
    return <Loader fullScreen text="Loading market data..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Markets</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isConnected ? (
              <span className="flex items-center">
                <span className="h-2 w-2 bg-success rounded-full mr-2"></span>
                Live data connected
              </span>
            ) : (
              <span className="flex items-center">
                <span className="h-2 w-2 bg-error rounded-full mr-2"></span>
                Live data disconnected
              </span>
            )}
          </p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search coins..."
              className="pl-10 pr-4 py-2 w-full md:w-64 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-300 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      <MarketStats />
      

     {activeTab === 'Announcements' && (
  <div className="mt-6 bg-white dark:bg-dark-300 p-4 rounded shadow">
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Latest Announcements</h2>
    <ul className="space-y-4">
      {announcements.map(item => (
        <li key={item.annId} className="border-b pb-2">
          <a
            href={item.annUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            {item.annTitle}
          </a>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(item.cTime).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  </div>
)}

{activeTab === 'spot' && (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          - This is Spot tab
        </p>
        <div className="flex gap-1 mb-2">
  {['USDT', 'USDC', 'BTC', 'ETH'].map((type) => (
    <button
      key={type}
      onClick={() => setFilterType(type)}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
        filterType === type
          ? 'bg-black text-white border-black'
          : 'bg-white text-gray-500 border-gray-300 hover:border-black'
      }`}
    >
      {type}
    </button>
  ))}
</div>

    {/* {filteredCurrencies.map((currency) => ( */}
      {filteredCurrencies
  .filter((currency) => currency.symbol.endsWith(`-${filterType}`))
  .map((currency) => (
      <div
       
        key={currency.symbol}
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
            {currency.isFavorite ? <Star size={18} /> : <StarOff size={18} />}
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
    ))}
  </div>
)}



{activeTab === 'all' && (
  <div className="mt-6 bg-white dark:bg-dark-300 p-4 rounded shadow">
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">All Market Tickers</h2>

    {loading ? (
      <div className="text-center text-gray-600 dark:text-gray-300">Loading data...</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currencies
          .filter(currency =>
            currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((currency, index) => (
            <div
              key={index}
              className="border p-4 rounded-md bg-white dark:bg-dark-200 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currency.symbol}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currency.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-500">${currency.price.toFixed(4)}</p>
                  <p
                    className={`text-sm ${
                      currency.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {currency.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
)}


      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="bg-white dark:bg-dark-300 rounded-lg shadow overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                  Favorite
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name {renderSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end">
                    Price {renderSortIcon('price')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('change24h')}
                >
                  <div className="flex items-center justify-end">
                    24h Change {renderSortIcon('change24h')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort('volume24h')}
                >
                  <div className="flex items-center justify-end">
                    24h Volume {renderSortIcon('volume24h')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center justify-end">
                    Market Cap {renderSortIcon('marketCap')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-300 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map(currency => (
                  <CurrencyPair
                    key={currency.symbol}
                    currency={currency}
                    toggleFavorite={toggleFavorite}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <TrendingUp size={40} className="mb-2 text-gray-400" />
                      <p className="text-lg font-medium">No currencies found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;