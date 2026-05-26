import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';

interface Announcement {
  annId: string;
  annTitle: string;
  annUrl: string;
  cTime: number;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/v3/market/announcements`);
        setAnnouncements(res.data.announcements || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        toast.error('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter announcements
  useEffect(() => {
    let result = [...announcements];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(announcement =>
        announcement.annTitle.toLowerCase().includes(term)
      );
    }

    setFilteredAnnouncements(result);
  }, [announcements, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <Loader fullScreen text="Loading announcements..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Announcements</h1>
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
            placeholder="Search announcements..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-300 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.annId}
              className="bg-white dark:bg-dark-300 border border-gray-200 dark:border-dark-200 rounded-lg p-6 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <a
                    href={announcement.annUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2"
                  >
                    {announcement.annTitle}
                    <ExternalLink size={16} />
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {new Date(announcement.cTime).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>

                <a
                  href={announcement.annUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors font-medium text-sm"
                >
                  <span>Read More</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchTerm ? 'No announcements found matching your search' : 'No announcements available'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-300 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Announcements</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{announcements.length}</p>
        </div>
        <div className="bg-white dark:bg-dark-300 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Showing Results</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{filteredAnnouncements.length}</p>
        </div>
        <div className="bg-white dark:bg-dark-300 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Latest Update</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {announcements.length > 0
              ? new Date(announcements[0].cTime).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
