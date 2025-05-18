
import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { TranslationProvider } from '../contexts/TranslationContext';
import { AuthProvider } from '../contexts/AuthContext';
import { UiProvider } from '../contexts/UiContext';
import Dashboard from './admin/Dashboard';

// Create a wrapper component that uses the contexts
const DashboardContent = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

// Main AdminDashboard component wrapped with providers
const AdminDashboard = () => {
  return (
    <TranslationProvider>
      <AuthProvider>
        <UiProvider>
          <DashboardContent />
        </UiProvider>
      </AuthProvider>
    </TranslationProvider>
  );
};

export default AdminDashboard;
