// import React, { Suspense, lazy } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import Loader from './components/ui/Loader';
// import Layout from './components/layout/Layout';
// import PublicRoute from './components/routes/PublicRoute';
// import PrivateRoute from './components/routes/PrivateRoute';
// import TrendingCoins from './pages/dashboard/components/Trending';
// import TopGainers from './pages/dashboard/components/Topgainers';
// import TopLosers from './pages/dashboard/components/Lossers';

// // Lazily load pages
// const Home = lazy(() => import('./pages/Home'));
// const Login = lazy(() => import('./pages/auth/Login'));
// const Register = lazy(() => import('./pages/auth/Register'));
// const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
// const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
// const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
// const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
// const Profile = lazy(() => import('./pages/dashboard/Profile'));
// const Settings = lazy(() => import('./pages/dashboard/Settings'));
// const Favorites = lazy(() => import('./pages/dashboard/Favorites'));
// const AllTickers = lazy(() => import('./pages/dashboard/AllTickers'));
// const SpotMarkets = lazy(() => import('./pages/dashboard/SpotMarkets'));
// const Announcements = lazy(() => import('./pages/dashboard/Announcements'));
// const NotFound = lazy(() => import('./pages/NotFound'));

// function App() {
//   const { loading } = useAuth();

//   if (loading) {
//     return <Loader fullScreen />;
//   }

//   return (
//     <Suspense fallback={<Loader fullScreen />}>
//       <Routes>
//         {/* Home page - accessible to ALL users (authenticated and unauthenticated) */}
//         <Route path="/" element={<Home />} />

//         {/* Public Auth Routes - only for unauthenticated users */}
//         <Route element={<PublicRoute />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/verify-otp" element={<VerifyOTP />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//         </Route>

//         {/* Private Routes - only for authenticated users */}
//         <Route element={<PrivateRoute />}>
//           <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
//           <Route path="/profile" element={<Layout><Profile /></Layout>} />
//           <Route path="/settings" element={<Layout><Settings /></Layout>} />
//           <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
//           <Route path="/all-tickers" element={<Layout><AllTickers /></Layout>} />
//           <Route path="/spot-markets" element={<Layout><SpotMarkets /></Layout>} />
//           <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
//           <Route path="/trending" element={<Layout><TrendingCoins /></Layout>} />
//           <Route path="/gainers" element={<Layout><TopGainers /></Layout>} />
//           <Route path="/toplosers" element={<Layout><TopLosers /></Layout>} />
//         </Route>

//         {/* Redirect /app to /dashboard for backward compatibility */}
//         <Route path="/app" element={<Navigate to="/dashboard" replace />} />
//         <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
//         <Route path="/app/profile" element={<Navigate to="/profile" replace />} />
//         <Route path="/app/settings" element={<Navigate to="/settings" replace />} />
//         <Route path="/app/favorites" element={<Navigate to="/favorites" replace />} />
//         <Route path="/app/all-tickers" element={<Navigate to="/all-tickers" replace />} />
//         <Route path="/app/spot-markets" element={<Navigate to="/spot-markets" replace />} />
//         <Route path="/app/announcements" element={<Navigate to="/announcements" replace />} />
//         <Route path="/app/trending" element={<Navigate to="/trending" replace />} />
//         <Route path="/app/gainers" element={<Navigate to="/gainers" replace />} />
//         <Route path="/app/toplosers" element={<Navigate to="/toplosers" replace />} />

//         {/* 404 Route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Suspense>
//   );
// }

// export default App;

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Loader from './components/ui/Loader';
import Layout from './components/layout/Layout';

// =======================
// Lazy Loaded Pages
// =======================

const Home = lazy(() => import('./pages/Home'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Favorites = lazy(() => import('./pages/dashboard/Favorites'));
const AllTickers = lazy(() => import('./pages/dashboard/AllTickers'));
const SpotMarkets = lazy(() => import('./pages/dashboard/SpotMarkets'));
const Announcements = lazy(() => import('./pages/dashboard/Announcements'));

const TrendingCoins = lazy(
  () => import('./pages/dashboard/components/Trending')
);

const TopGainers = lazy(
  () => import('./pages/dashboard/components/Topgainers')
);

const TopLosers = lazy(
  () => import('./pages/dashboard/components/Lossers')
);

const NotFound = lazy(() => import('./pages/NotFound'));

// =======================
// Private Route
// =======================

function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// =======================
// Public Route
// =======================

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

// =======================
// Layout Wrapper
// =======================

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// =======================
// App
// =======================

function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* =======================
            PUBLIC HOME PAGE
        ======================= */}
        <Route path="/" element={<Home />} />

        {/* =======================
            AUTH ROUTES
        ======================= */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* =======================
            PRIVATE ROUTES
        ======================= */}
        <Route element={<PrivateRoute />}>
          <Route element={<LayoutWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/all-tickers" element={<AllTickers />} />
            <Route path="/spot-markets" element={<SpotMarkets />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/trending" element={<TrendingCoins />} />
            <Route path="/gainers" element={<TopGainers />} />
            <Route path="/toplosers" element={<TopLosers />} />
          </Route>
        </Route>

        {/* =======================
            OLD ROUTE REDIRECTS
        ======================= */}
        <Route
          path="/app"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/app/dashboard"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/app/profile"
          element={<Navigate to="/profile" replace />}
        />

        <Route
          path="/app/settings"
          element={<Navigate to="/settings" replace />}
        />

        <Route
          path="/app/favorites"
          element={<Navigate to="/favorites" replace />}
        />

        <Route
          path="/app/all-tickers"
          element={<Navigate to="/all-tickers" replace />}
        />

        <Route
          path="/app/spot-markets"
          element={<Navigate to="/spot-markets" replace />}
        />

        <Route
          path="/app/announcements"
          element={<Navigate to="/announcements" replace />}
        />

        <Route
          path="/app/trending"
          element={<Navigate to="/trending" replace />}
        />

        <Route
          path="/app/gainers"
          element={<Navigate to="/gainers" replace />}
        />

        <Route
          path="/app/toplosers"
          element={<Navigate to="/toplosers" replace />}
        />

        {/* =======================
            404
        ======================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;