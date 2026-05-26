import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-300 border-t border-gray-200 dark:border-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <p className="text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} CryptoMarket. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center md:justify-end mt-4 md:mt-0">
            <div className="flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-primary-500">
                <Github size={20} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-primary-500">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-primary-500">
                <Facebook size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center md:text-left">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Disclaimer: Trading cryptocurrencies involves risk. Do your own research before investing.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;