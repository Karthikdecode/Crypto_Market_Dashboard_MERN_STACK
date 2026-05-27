import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const HomeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Dashboard', id: 'features' },
    { label: 'About', id: 'about' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-orange-500/20"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg blur opacity-75 animate-pulse"></div>
              <div className="relative w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  ₿
                </span>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent hidden sm:inline">
              CryptoHub
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="px-4 py-2 text-gray-300 hover:text-orange-400 transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-white border border-orange-500/50 rounded-lg hover:border-orange-500 transition-colors duration-300 font-semibold"
            >
              Login
            </motion.button>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg font-semibold shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-shadow duration-300"
            >
              Sign Up
            </motion.button> */}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="md:hidden text-orange-400"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="block px-4 py-2 text-gray-300 hover:text-orange-400 transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-orange-500/20">
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-white border border-orange-500/50 rounded-lg hover:border-orange-500 transition-colors duration-300"
              >
                Login
              </button>
              {/* <button
                onClick={() => {
                  navigate('/register');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg font-semibold"
              >
                Sign Up
              </button> */}
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
};

export default HomeHeader;
