
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { UiProvider } from '@/contexts/UiContext';
import { AdminLayout } from '@/components/layout/AdminLayout';

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <TranslationProvider>
        <UiProvider>
          <div className="admin-theme min-h-screen w-full">
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </div>
        </UiProvider>
      </TranslationProvider>
    </AuthProvider>
  );
};

export default AdminDashboard;
