import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthPreviewSection = () => {
  const navigate = useNavigate();

  const mockSignupFields = [
    { icon: User, label: 'Full Name', value: 'John Trader' },
    { icon: Mail, label: 'Email Address', value: 'john@cryptohub.com' },
    { icon: Lock, label: 'Password', value: '••••••••' },
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    viewport: { once: true, amount: 0.3 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    viewport: { once: true },
  };

  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                CryptoHub Today
              </span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Create an account in seconds and get instant access to our powerful crypto tracking dashboard. Secure, fast, and completely free.
            </p>

            <motion.div
              variants={containerVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="space-y-4 mb-10"
            >
              {[
                'Sign up with email or social media',
                'Verify your identity with OTP',
                'Get instant access to dashboard',
                'Start tracking crypto in real-time',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-white font-bold text-sm">✓</span>
                  </motion.div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300 group"
              >
                Create Account
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-transparent border-2 border-orange-400/50 text-orange-400 font-bold rounded-lg hover:border-orange-400 hover:bg-orange-400/10 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Signup Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="perspective"
          >
            {/* Outer glow */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(251, 146, 60, 0.3)',
                  '0 0 40px rgba(251, 146, 60, 0.5)',
                  '0 0 20px rgba(251, 146, 60, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-1 rounded-2xl bg-gradient-to-br from-orange-500/30 to-purple-500/10"
            >
              {/* Card */}
              <div className="p-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-orange-500/30">
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Create Account</h3>
                  <p className="text-gray-400 text-sm">Join thousands of crypto traders</p>
                </div>

                {/* Form Fields */}
                <motion.div
                  variants={containerVariants}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="space-y-4 mb-6"
                >
                  {mockSignupFields.map((field, index) => {
                    const Icon = field.icon;
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        className="p-3 rounded-lg bg-slate-800/50 border border-orange-500/20 hover:border-orange-400/50 transition-all duration-300 flex items-center gap-3"
                      >
                        <Icon className="text-orange-400 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">{field.label}</p>
                          <p className="text-white font-medium">{field.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Button */}
                {/* <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300"
                >
                  Sign Up
                </motion.button> */}

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-4">
                  Already have account?{' '}
                  <span className="text-orange-400 font-semibold cursor-pointer hover:text-orange-300">
                    Sign In
                  </span>
                </p>

                {/* Security badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-orange-500/20"
                >
                  <Lock size={16} className="text-green-400" />
                  <span className="text-xs text-gray-400">Secure • Encrypted • Protected</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthPreviewSection;
