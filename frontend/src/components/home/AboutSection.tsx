import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, BarChart3, Lock } from 'lucide-react';

const AboutSection = () => {
  const navigate = useNavigate();

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const IconCard = ({ icon: Icon, title, description, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-6 rounded-xl border border-orange-500/20 group-hover:border-orange-400/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400/30 to-purple-400/30 mb-4"
        >
          <Icon className="text-orange-400" size={24} />
        </motion.div>
        <h3 className="font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  );

  return (
    <section id="about" className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, -50, 0], y: [0, -100, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 5 }}
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
              Why Choose
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                CryptoHub?
              </span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We're committed to providing the most reliable, fast, and user-friendly cryptocurrency tracking platform. Our advanced technology ensures you always stay ahead in the crypto market.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Real-time Data', desc: 'Updated every second' },
                { label: 'Zero Fees', desc: 'Completely free to use' },
                { label: 'Secure', desc: 'Bank-level encryption' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all duration-300"
            >
              Get Started Free
            </motion.button>
          </motion.div>

          {/* Right Visual - 3D Elements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-96 flex items-center justify-center"
          >
            {/* Central rotating element */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-64 h-64 border-2 border-dashed border-orange-400/30 rounded-full"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute w-48 h-48 border-2 border-dashed border-purple-400/30 rounded-full"
            />

            {/* Floating cards */}
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              className="absolute top-0 left-8"
            >
              <IconCard
                icon={Shield}
                title="Secure"
                description="Advanced encryption"
                delay={0}
              />
            </motion.div>

            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 1.3 }}
              className="absolute top-32 right-8"
            >
              <IconCard
                icon={Zap}
                title="Fast"
                description="Lightning quick"
                delay={0.1}
              />
            </motion.div>

            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 2.6 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <IconCard
                icon={BarChart3}
                title="Powerful"
                description="Advanced analytics"
                delay={0.2}
              />
            </motion.div>

            {/* Center glowing element */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px rgba(251, 146, 60, 0.5)',
                  '0 0 40px rgba(251, 146, 60, 0.8)',
                  '0 0 20px rgba(251, 146, 60, 0.5)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center"
            >
              <Lock className="text-white" size={40} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
