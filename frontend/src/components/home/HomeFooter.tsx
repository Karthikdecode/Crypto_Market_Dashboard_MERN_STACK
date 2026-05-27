import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';

const HomeFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    Product: ['Dashboard', 'Features', 'Pricing', 'Security'],
    Company: ['About Us', 'Blog', 'Careers', 'Contact'],
    Resources: ['Documentation', 'API Reference', 'FAQ', 'Support'],
    Legal: ['Privacy', 'Terms', 'Cookie Policy', 'License'],
  };

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Github, label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-500' },
  ];

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
    <footer className="relative bg-slate-950 border-t border-orange-500/20 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Section */}
            <motion.div
              variants={itemVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg blur opacity-75"></div>
                  <div className="relative w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                      ₿
                    </span>
                  </div>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  CryptoHub
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                The ultimate platform for real-time cryptocurrency tracking and portfolio management.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg bg-orange-500/10 text-gray-400 transition-colors duration-300 ${social.color}`}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <motion.div
                key={title}
                variants={itemVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                <h3 className="text-white font-bold mb-4">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 5, color: '#fb9241' }}
                        className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Section */}
          <motion.div
            variants={itemVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-purple-500/5 border border-orange-500/30 mb-12"
          >
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get the latest crypto market updates and insights.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-900/50 border border-orange-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mb-8 origin-left"
          />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <motion.p
              variants={itemVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="text-gray-400 text-sm text-center md:text-left"
            >
              © 2026 CryptoHub. All rights reserved.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="flex flex-wrap gap-6 justify-center md:justify-end"
            >
              {[
                { icon: Mail, text: 'hello@cryptohub.com' },
                { icon: Phone, text: '+1 (555) 123-4567' },
                { icon: MapPin, text: 'Global' },
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <motion.a
                    key={index}
                    href="#"
                    variants={itemVariants}
                    className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm group"
                  >
                    <Icon
                      size={16}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    {contact.text}
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300 z-40"
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
};

export default HomeFooter;
