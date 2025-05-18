
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { TranslationProvider } from '../contexts/TranslationContext';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './admin/Dashboard';

const AdminDashboard = () => {
  return (
    <TranslationProvider>
      <AuthProvider>
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </AuthProvider>
    </TranslationProvider>
  );
};

export default AdminDashboard;
