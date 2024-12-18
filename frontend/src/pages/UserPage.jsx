import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header';
import UserDashboard from '../components/Dashboard/UserDashboard';

const UserPage = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <UserDashboard />
    </div>
  );
};

export default UserPage;

