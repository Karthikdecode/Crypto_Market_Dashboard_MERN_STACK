import React from 'react';
import { Activity, Star, Globe, TrendingUp } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: 'overview' | 'favorites' | 'all' | 'spot' | 'Announcements';
  setActiveTab: (tab: 'overview' | 'favorites' | 'all' | 'spot' | 'Announcements') => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Market Overview currencies', icon: <Activity size={16} /> },
    { id: 'favorites', label: 'Favorites', icon: <Star size={16} /> },
    { id: 'all', label: 'ALL Market Tickers', icon: <Globe size={16} /> },
    { id: 'spot', label: 'Spot', icon: <TrendingUp size={16} /> },
    { id: 'Announcements', label: 'Announcements', icon: <TrendingUp size={16} /> },
  ] as const;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              mr-4 py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap
              ${activeTab === tab.id
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardTabs;