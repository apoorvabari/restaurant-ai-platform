import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';

// Admin Routes
import AdminPage from '../features/admin/pages/AdminPage';

// User Routes
import DashboardPage from '../features/user/pages/DashboardPage';
import OrdersPage from '../features/user/pages/OrdersPage';
import ReservationPage from '../features/user/pages/ReservationPage';
import FeedbackPage from '../features/user/pages/FeedbackPage';

// Public Routes
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PublicFeedbackPage from '../features/public/pages/PublicFeedbackPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/feedbacks" element={<PublicFeedbackPage />} />

      {/* Admin Routes - Protected, requires ADMIN role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* User Routes - Protected, requires authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <FeedbackPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
