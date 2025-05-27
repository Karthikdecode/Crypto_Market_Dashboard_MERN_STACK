import React, { useState } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // If token is not provided in URL, redirect to forgot password
  if (!token) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await resetPassword(token, data.password);
      toast.success('Password reset successful! You can now login with your new password.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password reset failed. Please try again.');
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
            Create New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your password must be at least 6 characters
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="password"
              type="password"
              label="New Password"
              placeholder="Create a new password"
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

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Reset Password
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

export default ResetPassword;