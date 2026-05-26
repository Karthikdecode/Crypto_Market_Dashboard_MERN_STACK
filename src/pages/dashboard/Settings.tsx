import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, Bell, Shield, Eye, Moon, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    darkMode: theme === 'dark',
    language: 'en',
    timezone: 'UTC',
    privacyLevel: 'public'
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingChange = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleThemeChange = () => {
    handleSettingChange('darkMode');
    toggleTheme();
    toast.success('Theme updated successfully!');
  };

  const handleSaveProfile = () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }
    toast.success('Profile updated successfully!');
    setIsEditing({ name: false, email: false });
  };

  const handleChangePassword = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully!');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-light-200 dark:bg-dark-400 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center text-primary-500 hover:text-primary-600 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account preferences and settings</p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Eye size={22} className="mr-3 text-primary-500" />
              Profile Settings
            </h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing.name ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <button
                      onClick={() => handleSaveProfile()}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 dark:text-white font-medium">{formData.name}</p>
                    <button
                      onClick={() => setIsEditing({ ...isEditing, name: true })}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing.email ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <button
                      onClick={() => handleSaveProfile()}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 dark:text-white font-medium">{formData.email}</p>
                    <button
                      onClick={() => setIsEditing({ ...isEditing, email: true })}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Lock size={22} className="mr-3 text-primary-500" />
              Security Settings
            </h2>

            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Change Password</h3>
              
              <input
                type="password"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none"
              />

              <input
                type="password"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none"
              />

              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Update Password
              </button>
            </div>

            {/* Two Factor Auth */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Add extra security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => {
                      handleSettingChange('twoFactorAuth');
                      toast.success('2FA setting updated!');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Bell size={22} className="mr-3 text-primary-500" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Notifications</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Get updates about your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-200">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Push Notifications</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Browser push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleSettingChange('pushNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Moon size={22} className="mr-3 text-primary-500" />
              Display Settings
            </h2>

            <div className="space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dark Mode</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Switch between light and dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={handleThemeChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-200">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Language</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select your preferred language</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-200">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Timezone</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Set your timezone for accurate times</p>
                </div>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST (UTC-5)</option>
                  <option value="CST">CST (UTC-6)</option>
                  <option value="PST">PST (UTC-8)</option>
                  <option value="IST">IST (UTC+5:30)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-dark-300 rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Globe size={22} className="mr-3 text-primary-500" />
              Privacy & Visibility
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Profile Visibility
              </label>
              <div className="space-y-3">
                {['Public', 'Private', 'Friends Only'].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      value={level.toLowerCase().replace(' ', '-')}
                      checked={settings.privacyLevel === level.toLowerCase().replace(' ', '-')}
                      onChange={(e) => setSettings({ ...settings, privacyLevel: e.target.value })}
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Save Settings Button */}
          <div className="flex gap-4">
            <Button fullWidth>Save All Changes</Button>
            <Link to="/profile" className="flex-1">
              <button className="w-full px-4 py-2 border border-gray-300 dark:border-dark-200 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors font-medium">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
