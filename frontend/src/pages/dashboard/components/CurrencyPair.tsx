import React from 'react';
import { Star, StarOff } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface Currency {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  isFavorite: boolean;
}

interface CurrencyPairProps {
  currency: Currency;
  toggleFavorite: (symbol: string) => void;
}

const CurrencyPair: React.FC<CurrencyPairProps> = ({ currency, toggleFavorite }) => {
  const { symbol, name, price, change24h, volume24h, marketCap, isFavorite } = currency;
  
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 10000) return price.toFixed(2);
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };
  
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };
  
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <button 
          onClick={() => toggleFavorite(symbol)}
          className="text-gray-400 hover:text-yellow-400 focus:outline-none"
        >
          {isFavorite ? (
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff size={18} />
          )}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{symbol}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
        ${formatPrice(price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <span className={`inline-block px-2 py-1 rounded ${
          change24h > 0 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
        {formatLargeNumber(volume24h)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
        {formatLargeNumber(marketCap)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <Button size="sm" variant="outline">
          Trade
        </Button>
      </td>
    </tr>
  );
};

export default CurrencyPair;