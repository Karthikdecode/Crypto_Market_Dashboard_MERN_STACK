import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../../data/cryptoData';

const FAQSection = () => {
  const [openId, setOpenId] = useState<number | null>(0);

  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    viewport: { once: true, amount: 0.3 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    viewport: { once: true },
  };

  return (
    <section id="faq" className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 -right-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ y: [0, 100, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
            <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Get Your Answers Here
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about CryptoHub
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="group"
            >
              <motion.button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full p-6 rounded-xl border border-orange-500/20 group-hover:border-orange-400/50 bg-gradient-to-br from-slate-900/40 to-slate-950/60 backdrop-blur-md transition-all duration-300 text-left"
                whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{
                      rotate: openId === faq.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <ChevronDown className="text-orange-400" size={24} />
                  </motion.div>
                </div>
              </motion.button>

              {/* Answer */}
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 rounded-b-xl border border-t-0 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-purple-500/5 backdrop-blur-md">
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-purple-500/10 backdrop-blur-md"
        >
          <p className="text-gray-300 mb-4">Still have questions?</p>
          <p className="text-gray-400 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
