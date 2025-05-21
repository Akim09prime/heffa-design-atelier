
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import DesignerDashboard from './pages/DesignerDashboard';

// Admin routes
import Dashboard from './pages/admin/Dashboard';
import Materials from './pages/admin/Materials';
import Processing from './pages/admin/Processing';
import Accessories from './pages/admin/Accessories';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';
import Analytics from './pages/admin/Analytics';
import ImportData from './pages/admin/ImportData';
import Settings from './pages/admin/Settings';
import { AdminLayout } from './components/layout/AdminLayout';

// Designer routes
import DesignerProjects from './pages/designer/Projects';
import DesignerNewProject from './pages/designer/NewProject';
import ProjectEdit from './pages/designer/ProjectEdit';
import ProjectEditor3D from './pages/designer/ProjectEditor3D';
import ProjectQuote from './pages/designer/ProjectQuote';
import ExportProject from './pages/designer/ExportProject';
import DesignerMaterials from './pages/designer/Materials';
import DesignerAccessories from './pages/designer/Accessories';
import DesignerClients from './pages/designer/Clients';
import ImportProject from './pages/designer/ImportProject';
import DesignerExports from './pages/designer/Exports';
import DesignerSettings from './pages/designer/Settings';
import DesignerAiAssistant from './pages/designer/AiAssistant';
import DesignerModules from './pages/designer/Modules';
import SpaceView from './pages/designer/SpaceView';
import DesignerLab from './pages/designer/DesignerLab';
import DesignerReports from './pages/designer/Reports';

// Client routes
import ClientProjects from './pages/client/Projects';
import ClientNewProject from './pages/client/NewProject';
import ClientAccessories from './pages/client/Accessories';
import ClientDashboardContent from './pages/client/Dashboard';
import ClientSettings from './pages/client/Settings';
import ClientShowroom from './pages/client/Showroom';
import ClientFavorites from './pages/client/Favorites';
import ClientAiAssistant from './pages/client/AiAssistant';
import ClientCart from './pages/client/Cart';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="materials" element={<Materials />} />
        <Route path="processing" element={<Processing />} />
        <Route path="accessories" element={<Accessories />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="import" element={<ImportData />} />
        <Route path="settings" element={<Settings />} />
        <Route index element={<Dashboard />} />
      </Route>
      
      {/* Designer routes */}
      <Route path="/designer" element={<DesignerDashboard />}>
        <Route index element={<DesignerProjects />} />
        <Route path="projects" element={<DesignerProjects />} />
        <Route path="projects/new" element={<DesignerNewProject />} />
        <Route path="projects/:projectId" element={<ProjectEdit />} />
        <Route path="projects/:projectId/3d" element={<ProjectEditor3D />} />
        <Route path="projects/:projectId/quote" element={<ProjectQuote />} />
        <Route path="projects/:projectId/export" element={<ExportProject />} />
        <Route path="projects/:projectId/space/:spaceId" element={<SpaceView />} />
        <Route path="materials" element={<DesignerMaterials />} />
        <Route path="accessories" element={<DesignerAccessories />} />
        <Route path="clients" element={<DesignerClients />} />
        <Route path="import" element={<ImportProject />} />
        <Route path="exports" element={<DesignerExports />} />
        <Route path="settings" element={<DesignerSettings />} />
        <Route path="assistant" element={<DesignerAiAssistant />} />
        <Route path="modules" element={<DesignerModules />} />
        <Route path="lab" element={<DesignerLab />} />
        <Route path="reports" element={<DesignerReports />} />
      </Route>
      
      {/* Client routes */}
      <Route path="/client" element={<ClientDashboard />}>
        <Route index element={<ClientDashboardContent />} />
        <Route path="projects" element={<ClientProjects />} />
        <Route path="projects/new" element={<ClientNewProject />} />
        <Route path="accessories" element={<ClientAccessories />} />
        <Route path="settings" element={<ClientSettings />} />
        <Route path="showroom" element={<ClientShowroom />} />
        <Route path="favorites" element={<ClientFavorites />} />
        <Route path="assistant" element={<ClientAiAssistant />} />
        <Route path="cart" element={<ClientCart />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
