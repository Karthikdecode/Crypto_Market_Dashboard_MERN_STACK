import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
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
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful! Please verify your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-light-200 dark:bg-dark-400">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-300 p-8 rounded-lg shadow-md animate-fadeIn">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start your crypto trading journey
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              leftIcon={<User size={18} className="text-gray-500" />}
              error={errors.name?.message}
              {...register('name')}
            />
            
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              leftIcon={<Mail size={18} className="text-gray-500" />}
              error={errors.email?.message}
              {...register('email')}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Create a password"
              leftIcon={<Lock size={18} className="text-gray-500" />}
              error={errors.password?.message}
              {...register('password')}
            />
            
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              leftIcon={<Lock size={18} className="text-gray-500" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-primary-500 hover:text-primary-600">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="font-medium text-primary-500 hover:text-primary-600">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            leftIcon={<UserPlus size={18} />}
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;