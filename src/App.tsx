import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Loader from './components/ui/Loader';
import Layout from './components/layout/Layout';
import PublicRoute from './components/routes/PublicRoute';
import PrivateRoute from './components/routes/PrivateRoute';
import TrendingCoins from './pages/dashboard/components/Trending';
import TopGainers from './pages/dashboard/components/Topgainers';
import TopLosers from './pages/dashboard/components/Lossers';

// Lazily load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/trending" element={<TrendingCoins />} />
            <Route path="/gainers" element={<TopGainers />} />
            <Route path="/toplosers" element={<TopLosers />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;