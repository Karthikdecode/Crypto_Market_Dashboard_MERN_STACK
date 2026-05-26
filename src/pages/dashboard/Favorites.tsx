import React, { useState, useEffect } from 'react';
import { Search, Star, StarOff, Filter, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';

interface Currency {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  isFavorite: boolean;
}

const Favorites = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Currency; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/currencies`);
        const data = await response.json();

        if (data.currencies) {
          setCurrencies(data.currencies);
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
        toast.error('Failed to load currencies');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Filter currencies - favorites only
  useEffect(() => {
    let result = currencies.filter(currency => currency.isFavorite);

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
    setCurrentPage(1);
  }, [currencies, searchTerm, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCurrencies = filteredCurrencies.slice(startIndex, endIndex);

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

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <Loader fullScreen text="Loading favorites..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Favorite Currencies</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-300 rounded-lg shadow mb-6">
        <div className="relative p-4">
          <Search size={18} className="absolute left-6 top-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search favorites..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-300 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-300 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-200 border-b border-gray-200 dark:border-dark-100">
              <tr>
                <th
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center text-xs font-medium text-gray-900 dark:text-white uppercase">
                    Name {renderSortIcon('name')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center text-xs font-medium text-gray-900 dark:text-white uppercase">
                    Price {renderSortIcon('price')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-100"
                  onClick={() => handleSort('change24h')}
                >
                  <div className="flex items-center text-xs font-medium text-gray-900 dark:text-white uppercase">
                    24h Change {renderSortIcon('change24h')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-100"
                  onClick={() => handleSort('volume24h')}
                >
                  <div className="flex items-center text-xs font-medium text-gray-900 dark:text-white uppercase">
                    Volume {renderSortIcon('volume24h')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-white uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-200">
              {paginatedCurrencies.length > 0 ? (
                paginatedCurrencies.map((currency, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{currency.symbol}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{currency.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      ${currency.price.toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${currency.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {currency.change24h.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {currency.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFavorite(currency.symbol)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-dark-200 rounded transition-colors"
                      >
                        {currency.isFavorite ? (
                          <Star size={18} className="text-yellow-400 fill-yellow-400" />
                        ) : (
                          <StarOff size={18} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                    No favorite currencies yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {paginatedCurrencies.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-300 text-gray-900 dark:text-gray-100"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCurrencies.length)} of {filteredCurrencies.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
