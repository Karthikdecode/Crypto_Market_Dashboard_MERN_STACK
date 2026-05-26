import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardTabsProps {
  activeTab: 'overview' | 'favorites';
  setActiveTab: (tab: 'overview' | 'favorites') => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId: string) => {
    if (tabId === 'overview') {
      setActiveTab('overview');
    } else if (tabId === 'favorites') {
      navigate('/favorites');
    } else if (tabId === 'all') {
      navigate('/all-tickers');
    } else if (tabId === 'spot') {
      navigate('/spot-markets');
    } else if (tabId === 'Announcements') {
      navigate('/announcements');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Market Overview', count: 635, color: 'bg-primary-500', textColor: 'text-white' },
    { id: 'favorites', label: 'Favorites', count: 12, color: 'bg-gray-200 dark:bg-dark-200', textColor: 'text-gray-700 dark:text-gray-300' },
    { id: 'all', label: 'ALL Tickers', count: 500, color: 'bg-blue-100 dark:bg-blue-900', textColor: 'text-blue-700 dark:text-blue-300' },
    { id: 'spot', label: 'Spot Markets', count: 250, color: 'bg-green-100 dark:bg-green-900', textColor: 'text-green-700 dark:text-green-300' },
    { id: 'Announcements', label: 'Announcements', count: 45, color: 'bg-orange-100 dark:bg-orange-900', textColor: 'text-orange-700 dark:text-orange-300' },
  ] as const;

  return (
    <div className="my-6 flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            inline-flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-sm
            transition-all duration-200 transform hover:scale-105
            ${activeTab === tab.id
              ? `${tab.color} ${tab.textColor} shadow-lg`
              : `${tab.color} ${tab.textColor} opacity-70 hover:opacity-100`
            }
          `}
        >
          <span>{tab.label}</span>
          <span className={`
            font-bold rounded-full px-2.5 py-0.5 text-xs
            ${activeTab === tab.id
              ? 'bg-white/30 backdrop-blur-sm'
              : 'bg-black/10'
            }
          `}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;