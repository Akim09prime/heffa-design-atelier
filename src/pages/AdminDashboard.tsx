
import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './admin/Dashboard';
import { Card } from '@/components/ui/card';
import { TranslationProvider } from '@/contexts/TranslationContext';

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <TranslationProvider>
        <AdminLayout>
          <Card glass variant="admin" className="p-6">
            <Dashboard />
          </Card>
        </AdminLayout>
      </TranslationProvider>
    </AuthProvider>
  );
};

export default AdminDashboard;
