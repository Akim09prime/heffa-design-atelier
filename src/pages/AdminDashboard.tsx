
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthProvider } from '../contexts/AuthContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { UiProvider } from '@/contexts/UiContext';

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <TranslationProvider>
        <UiProvider>
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        </UiProvider>
      </TranslationProvider>
    </AuthProvider>
  );
};

export default AdminDashboard;
