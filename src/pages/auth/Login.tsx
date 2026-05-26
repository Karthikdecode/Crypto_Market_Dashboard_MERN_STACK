import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const message = location.state?.message;
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-light-200 dark:bg-dark-400">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row rounded-lg shadow-xl overflow-hidden bg-white dark:bg-dark-300">
          {/* Left side - Crypto Image */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-700 dark:to-primary-800 p-12 flex-col justify-center items-center relative overflow-hidden">
            {/* Floating crypto elements background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 text-white text-6xl">₿</div>
              <div className="absolute bottom-20 right-20 text-white text-5xl">Ξ</div>
              <div className="absolute top-1/3 right-10 text-white text-4xl">◆</div>
              <div className="absolute bottom-10 left-1/4 text-white text-5xl">₹</div>
            </div>

            <div className="relative z-10 text-center text-white">
              {/* Crypto illustration SVG */}
              <svg
                className="w-48 h-48 mx-auto mb-6 animate-pulse"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Bitcoin icon representation */}
                <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" />
                <path
                  d="M100 40V160M70 80C70 70 80 65 90 65C95 65 100 68 100 75C100 82 95 85 90 85H100M70 120C70 110 80 105 90 105C95 105 100 108 100 115C100 122 95 125 90 125H100"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="text-lg text-primary-100 mb-8">
                Access your crypto portfolio and start trading instantly
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div>
                  <p className="text-3xl font-bold">1M+</p>
                  <p className="text-primary-100 text-sm">Active Traders</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">$500B</p>
                  <p className="text-primary-100 text-sm">Daily Volume</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-primary-100 text-sm">Trading</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">100+</p>
                  <p className="text-primary-100 text-sm">Cryptocurrencies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-12">
      <div className="text-center">
          <div className="flex justify-center">
            <Logo className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              leftIcon={<Mail size={18} className="text-gray-500" />}
              error={errors.email?.message}
              {...register('email')}
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-500 hover:text-primary-600">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            leftIcon={<LogIn size={18} />}
          >
            Sign in
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
                Sign up
              </Link>
            </p>
          </div>
        </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;