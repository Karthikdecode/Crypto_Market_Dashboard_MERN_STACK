import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const location = useLocation();
  const message = location.state?.message;
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

  defaultValues: {
    email: 'demo-crypto@gmail.com',
    password: 'demo1234',
  },
  });

  React.useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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
            className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-orange-900 p-12 flex-col justify-center items-center relative overflow-hidden"
          >
            {/* Floating crypto elements background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-5"
            >
              <div className="absolute top-10 left-10 text-white text-6xl">₿</div>
              <div className="absolute bottom-20 right-20 text-white text-5xl">Ξ</div>
              <div className="absolute top-1/3 right-10 text-white text-4xl">◆</div>
              <div className="absolute bottom-10 left-1/4 text-white text-5xl">₹</div>
            </motion.div>

            <div className="relative z-10 text-center text-white">
              {/* Animated Bitcoin icon */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
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
                    d="M100 40V160M70 80C70 70 80 65 90 65C95 65 100 68 100 75C100 82 95 85 90 85H100M70 120C70 110 80 105 90 105C95 105 100 108 100 115C100 122 95 125 90 125H100"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                <p className="text-lg text-orange-100 mb-8">
                  Access your crypto portfolio and start trading instantly
                </p>
              </motion.div>

              {/* Statistics */}
              <motion.div
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
                }}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 gap-6 mt-12"
              >
                {[
                  { value: '1M+', label: 'Active Traders' },
                  { value: '$500B', label: 'Daily Volume' },
                  { value: '24/7', label: 'Trading' },
                  { value: '100+', label: 'Cryptocurrencies' },
                ].map((stat, index) => (
                  <motion.div key={index} variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-orange-100 text-sm">{stat.label}</p>
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
            className="w-full lg:w-1/2 p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex justify-center mb-6"
              >
                <Logo className="h-12 w-12" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Sign in to your account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
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

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter password"
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
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  leftIcon={<LogIn size={18} />}
                  className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
                >
                  Sign in
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                {/* <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                    Sign up
                  </Link>
                </p> */}
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;