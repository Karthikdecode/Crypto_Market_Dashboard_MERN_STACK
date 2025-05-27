import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${apiUrl}/auth/me`);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [apiUrl]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`http://localhost:5000/api/auth/register`, { name, email, password });
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/verify-otp`, { email, otp });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      navigate('/login', { state: { message: 'Password reset email sent!' } });
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await axios.post(`${apiUrl}/auth/reset-password`, { token, password });
      navigate('/login', { state: { message: 'Password reset successful!' } });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated: !!user,
        login, 
        register, 
        verifyOTP, 
        logout, 
        forgotPassword, 
        resetPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};