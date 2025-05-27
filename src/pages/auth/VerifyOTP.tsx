import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

const VerifyOTP = () => {
  const { verifyOTP } = useAuth();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  
  const { register, handleSubmit, formState: { errors } } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // If email is not provided in location state, redirect to register
  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const onSubmit = async (data: OtpFormData) => {
    try {
      setLoading(true);
      await verifyOTP(email, data.otp);
      toast.success('Email verified successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      // Implement resend OTP logic here
      toast.info('New OTP sent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
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
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              id="otp"
              type="text"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              leftIcon={<ShieldCheck size={18} className="text-gray-500" />}
              error={errors.otp?.message}
              {...register('otp')}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
          >
            Verify Email
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?{' '}
              <button 
                type="button"
                onClick={handleResendOTP}
                className="font-medium text-primary-500 hover:text-primary-600"
              >
                Resend
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;