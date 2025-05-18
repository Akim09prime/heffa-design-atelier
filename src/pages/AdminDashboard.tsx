
import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './admin/Dashboard';
import { UiProvider } from '../contexts/UiContext';

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <UiProvider>
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </UiProvider>
    </AuthProvider>
  );
};

export default AdminDashboard;
