import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header';
import AdminDashboard from '../components/Dashboard/AdminDashboard';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    return <Navigate to="/user" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;

