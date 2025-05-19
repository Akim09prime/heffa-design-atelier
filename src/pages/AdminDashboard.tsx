
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './admin/Dashboard';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { UiProvider } from '@/contexts/UiContext';

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <TranslationProvider>
        <UiProvider>
          <div className="admin-theme min-h-screen">
            <Dashboard />
          </div>
        </UiProvider>
      </TranslationProvider>
    </AuthProvider>
  );
};

export default AdminDashboard;
