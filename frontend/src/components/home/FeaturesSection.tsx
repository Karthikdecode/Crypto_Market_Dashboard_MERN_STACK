import { motion } from 'framer-motion';
import { features } from '../../data/cryptoData';

const FeaturesSection = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    viewport: { once: true, amount: 0.3 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
    viewport: { once: true },
  };

  return (
    <section id="features" className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-40 top-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ y: [-50, 50, -50] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-40 bottom-0 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ y: [50, -50, 50] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
            <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              For Smart Traders
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to track, analyze, and manage your cryptocurrency portfolio efficiently
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-purple-500/0 rounded-2xl blur-xl group-hover:from-orange-500/20 group-hover:to-purple-500/10 transition-all duration-300"
                whileHover={{ opacity: 1 }}
              />

              {/* Card */}
              <div className="relative p-8 rounded-2xl border border-orange-500/20 group-hover:border-orange-400/50 bg-gradient-to-br from-slate-900/40 to-slate-950/60 backdrop-blur-md transition-all duration-300">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-5xl mb-6 inline-block"
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                {/* Bottom accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="h-1 w-12 bg-gradient-to-r from-orange-400 to-orange-600 mt-4 origin-left"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6 text-lg">
            Ready to experience these features? Get started today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300"
          >
            Start Trading Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
