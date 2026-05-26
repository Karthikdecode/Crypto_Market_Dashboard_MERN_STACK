import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Filter, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites'>('overview');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Currency; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Get real-time data from WebSocket
  const { isConnected } = useCryptoSocket();
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
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);
  
  // Filter currencies based on active tab and search term
  useEffect(() => {
    let result = [...currencies];
    
    // Apply tab filtering
    if (activeTab === 'favorites') {
      result = result.filter(currency => currency.isFavorite);
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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCurrencies]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCurrencies = filteredCurrencies.slice(startIndex, endIndex);

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
              {paginatedCurrencies.length > 0 ? (
                paginatedCurrencies.map(currency => (
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

        {/* Pagination Controls */}
        {filteredCurrencies.length > 0 && (
          <div className="bg-gray-50 dark:bg-dark-200 px-6 py-4 border-t border-gray-200 dark:border-dark-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Rows per page selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-1 border border-gray-300 dark:border-dark-100 rounded-md text-sm bg-white dark:bg-dark-300 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {startIndex + 1}-{Math.min(endIndex, filteredCurrencies.length)} of {filteredCurrencies.length}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 dark:border-dark-100 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {(() => {
                const pages = [];
                const maxPagesToShow = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                
                if (endPage - startPage < maxPagesToShow - 1) {
                  startPage = Math.max(1, endPage - maxPagesToShow + 1);
                }

                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(<span key="dots-start" className="px-2 text-gray-400">...</span>);
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentPage === i
                          ? 'bg-primary-500 text-white'
                          : 'border border-gray-300 dark:border-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(<span key="dots-end" className="px-2 text-gray-400">...</span>);
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 dark:border-dark-100 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;