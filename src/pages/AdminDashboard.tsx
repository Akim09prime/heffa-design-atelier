
import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './admin/Dashboard';

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </AuthProvider>
  );
};

export default AdminDashboard;
