import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainAdminRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" />Authenticating…</div>;
  if (!user || user.role !== 'mainadmin') return <Navigate to="/login" replace />;
  return <Outlet />;
}
