import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, User, Calendar, Edit2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isVerified: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate fetching user profile data
      const mockUserData: UserProfile = {
        _id: user._id || '1',
        name: user.name || 'User',
        email: user.email || 'user@example.com',
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        isVerified: true
      };
      setUserProfile(mockUserData);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-light-200 dark:bg-dark-400 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Profile Found</h2>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-200 dark:bg-dark-400 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center text-primary-500 hover:text-primary-600 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-8">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200 dark:border-dark-200">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {userProfile.isVerified ? '✅ Verified Account' : 'Unverified Account'}
                </p>
              </div>
            </div>
            <Link to="/settings">
              <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors">
                <Edit2 size={20} />
              </button>
            </Link>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex items-start space-x-4">
              <User size={20} className="text-primary-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{userProfile.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <Mail size={20} className="text-primary-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{userProfile.email}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start space-x-4">
              <Calendar size={20} className="text-primary-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{userProfile.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-200 flex flex-col sm:flex-row gap-4">
            <Link to="/settings" className="flex-1">
              <Button fullWidth>Edit Profile</Button>
            </Link>
            <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-200 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors font-medium">
              Change Password
            </button>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Account Status</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Active</p>
          </div>
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Email Verified</p>
            <p className="text-2xl font-bold text-green-500 mt-2">Yes</p>
          </div>
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">2FA Status</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Disabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
