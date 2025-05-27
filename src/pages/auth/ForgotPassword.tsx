import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      await forgotPassword(data.email);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              leftIcon={<Mail size={18} className="text-gray-500" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Send Reset Instructions
          </Button>

          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center font-medium text-primary-500 hover:text-primary-600"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;