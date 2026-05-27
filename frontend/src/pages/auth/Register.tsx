import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerUser(data.name, data.email, data.password);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full relative z-10"
      >
        <div className="flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden border border-orange-500/20 bg-slate-950/50 backdrop-blur-md">
          {/* Left side - Crypto Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-900 p-12 flex-col justify-center items-center relative overflow-hidden"
          >
            {/* Floating crypto elements background */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-5"
            >
              <div className="absolute top-10 left-10 text-white text-6xl">₿</div>
              <div className="absolute bottom-20 right-20 text-white text-5xl">Ξ</div>
              <div className="absolute top-1/3 right-10 text-white text-4xl">◆</div>
              <div className="absolute bottom-10 left-1/4 text-white text-5xl">₹</div>
            </motion.div>

            <div className="relative z-10 text-center text-white">
              {/* Animated Ethereum icon */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="mb-6"
              >
                <svg
                  className="w-48 h-48 mx-auto"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" />
                  <path
                    d="M100 50L140 100L100 130L60 100L100 50ZM100 130L140 160L100 180L60 160L100 130Z"
                    stroke="white"
                    fill="white"
                    opacity="0.8"
                  />
                </svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-4">Start Trading Today</h2>
                <p className="text-lg text-purple-100 mb-8">
                  Join thousands of traders in the world's fastest growing crypto exchange
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
                }}
                initial="initial"
                animate="animate"
                className="space-y-4 mt-12"
              >
                {[
                  'Low trading fees and fast execution',
                  'Advanced security and 2FA protection',
                  '24/7 customer support',
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-purple-100 text-left">{feature}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-1/2 p-8 md:p-12 max-h-screen overflow-y-auto"
          >
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex justify-center mb-6"
              >
                <Logo className="h-12 w-12" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-600 bg-clip-text text-transparent">
                Create an account
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Start your crypto trading journey
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  id="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  leftIcon={<User size={18} className="text-gray-500" />}
                  error={errors.name?.message}
                  {...register('name')}
                  className="bg-slate-900/50 border-orange-500/30 focus:border-orange-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  leftIcon={<Mail size={18} className="text-gray-500" />}
                  error={errors.email?.message}
                  {...register('email')}
                  className="bg-slate-900/50 border-orange-500/30 focus:border-orange-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a password"
                  leftIcon={<Lock size={18} className="text-gray-500" />}
                  error={errors.password?.message}
                  {...register('password')}
                  className="bg-slate-900/50 border-orange-500/30 focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-orange-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative"
              >
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Confirm password"
                  leftIcon={<Lock size={18} className="text-gray-500" />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                  className="bg-slate-900/50 border-orange-500/30 focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-orange-400 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-2 py-2"
              >
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="block text-xs text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  leftIcon={<UserPlus size={18} />}
                  className="bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700"
                >
                  Create Account
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;