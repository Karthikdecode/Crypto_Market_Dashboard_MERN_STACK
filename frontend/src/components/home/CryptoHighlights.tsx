import { motion } from 'framer-motion';
import { cryptoHighlights } from '../../data/cryptoData';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CryptoHighlights = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    viewport: { once: true, amount: 0.3 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5 },
    viewport: { once: true },
  };

  return (
    <section className="relative min-h-screen flex items-center py-20 bg-slate-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Top Cryptocurrencies
            <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Live Market Prices
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Monitor the most popular cryptocurrencies with real-time price updates and market changes
          </p>
        </motion.div>

        {/* Crypto Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cryptoHighlights.map((crypto) => (
            <motion.div
              key={crypto.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card */}
              <div className="relative h-full p-6 rounded-2xl border border-orange-500/30 group-hover:border-orange-400/60 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
                {/* Top section */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-4xl mb-2">{crypto.image}</div>
                    <h3 className="text-xl font-bold text-white">{crypto.name}</h3>
                    <p className="text-orange-400 font-semibold">{crypto.symbol}</p>
                  </div>
                  {crypto.change >= 0 ? (
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <TrendingUp className="text-green-400" size={20} />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <TrendingDown className="text-red-400" size={20} />
                    </div>
                  )}
                </div>

                {/* Price section */}
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">Current Price</p>
                  <h4 className="text-3xl font-bold text-white">
                    ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h4>
                </div>

                {/* Change section */}
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className={`text-lg font-bold ${
                      crypto.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </span>
                  <span className="text-gray-400 text-sm">(24h change)</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min((crypto.change + 20) * 2, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      crypto.change >= 0
                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300"
          >
            View All Cryptocurrencies
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CryptoHighlights;
