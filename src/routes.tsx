
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Index from './pages/Index';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';

import Dashboard from './pages/designer/Dashboard';
import Projects from './pages/designer/Projects';
import Materials from './pages/designer/Materials';
import Clients from './pages/designer/Clients';
import AiAssistant from './pages/designer/AiAssistant';

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
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
