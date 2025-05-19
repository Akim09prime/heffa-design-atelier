
import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './admin/Dashboard';
import { Card } from '@/components/ui/card';

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <AdminLayout>
        <Card glass variant="admin" className="p-6">
          <Dashboard />
        </Card>
      </AdminLayout>
    </AuthProvider>
  );
};

export default AdminDashboard;
