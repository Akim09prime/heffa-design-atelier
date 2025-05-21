
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Index from './pages/Index';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';

// Designer pages
import Dashboard from './pages/designer/Dashboard';
import Projects from './pages/designer/Projects';
import Materials from './pages/designer/Materials';
import Clients from './pages/designer/Clients';
import AiAssistant from './pages/designer/AiAssistant';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMaterials from './pages/admin/Materials';
import AdminAccessories from './pages/admin/Accessories';
import AdminUsers from './pages/admin/Users';
import AdminProcessing from './pages/admin/Processing';
import AdminReports from './pages/admin/Reports';
import AdminAnalytics from './pages/admin/Analytics';
import AdminImportData from './pages/admin/ImportData';
import AdminSettings from './pages/admin/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  // Designer routes
  {
    path: '/designer/dashboard',
    element: <Dashboard />
  },
  {
    path: '/designer/projects',
    element: <Projects />
  },
  {
    path: '/designer/clients',
    element: <Clients />
  },
  {
    path: '/designer/materials',
    element: <Materials />
  },
  {
    path: '/designer/ai-assistant',
    element: <AiAssistant />
  },
  // Admin routes with layout
  {
    path: '/admin',
    element: <AdminDashboard />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'materials',
        element: <AdminMaterials />
      },
      {
        path: 'accessories',
        element: <AdminAccessories />
      },
      {
        path: 'users',
        element: <AdminUsers />
      },
      {
        path: 'processing',
        element: <AdminProcessing />
      },
      {
        path: 'reports',
        element: <AdminReports />
      },
      {
        path: 'analytics',
        element: <AdminAnalytics />
      },
      {
        path: 'import',
        element: <AdminImportData />
      },
      {
        path: 'settings',
        element: <AdminSettings />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
