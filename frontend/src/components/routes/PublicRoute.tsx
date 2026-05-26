import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // If user is already authenticated and tries to access a public route
  // (like login or register), redirect them to the dashboard
  if (isAuthenticated && !location.pathname.includes('verify-otp')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the public route
  return <Outlet />;
};

export default PublicRoute;