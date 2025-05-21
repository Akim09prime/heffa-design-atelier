
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // If user is not logged in or not an admin, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-6">Welcome to the administrator panel. Use the sidebar to navigate through the various sections.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-admin-bg-secondary p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Materials</h3>
            <p>Manage materials, suppliers and inventory</p>
          </div>
          <div className="bg-admin-bg-secondary p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Users</h3>
            <p>Manage user accounts and permissions</p>
          </div>
          <div className="bg-admin-bg-secondary p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Reports</h3>
            <p>View and generate reports</p>
          </div>
        </div>
        
        <Outlet />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
