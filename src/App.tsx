
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UiProvider } from './contexts/UiContext';
import { Toaster } from '@/components/ui/toaster';

// Auth pages
import Login from './pages/Login';

// Main pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Designer pages
import DesignerDashboard from './pages/DesignerDashboard';
import Projects from './pages/designer/Projects';
import NewProject from './pages/designer/NewProject';
import ProjectEditor3D from './pages/designer/ProjectEditor3D';
import ImportProject from './pages/designer/ImportProject';
import ExportProject from './pages/designer/ExportProject';
import Materials from './pages/designer/Materials';
import Accessories from './pages/designer/Accessories';
import Modules from './pages/designer/Modules';
import Clients from './pages/designer/Clients';
import Exports from './pages/designer/Exports';
import Settings from './pages/designer/Settings';
import AiAssistant from './pages/designer/AiAssistant';

// Client pages
import ClientDashboard from './pages/ClientDashboard';
import ClientProjects from './pages/client/Projects';
import ClientNewProject from './pages/client/NewProject';
import ClientShowroom from './pages/client/Showroom';
import ClientAccessories from './pages/client/Accessories';
import ClientSettings from './pages/client/Settings';
import ClientAiAssistant from './pages/client/AiAssistant';
import ClientFavorites from './pages/client/Favorites';
import ClientCart from './pages/client/Cart';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMaterials from './pages/admin/Materials';
import AdminAccessories from './pages/admin/Accessories';
import AdminProcessing from './pages/admin/Processing';
import AdminUsers from './pages/admin/Users';
import AdminReports from './pages/admin/Reports';
import AdminImportData from './pages/admin/ImportData';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminDashboard2 from './pages/admin/Dashboard';

import './App.css';

function App() {
  return (
    <UiProvider>
      <Router>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Designer routes */}
          <Route path="/designer/dashboard" element={<DesignerDashboard />} />
          <Route path="/designer/projects" element={<Projects />} />
          <Route path="/designer/new-project" element={<NewProject />} />
          <Route path="/designer/project/:projectId" element={<ProjectEditor3D />} />
          <Route path="/designer/import-project" element={<ImportProject />} />
          <Route path="/designer/export-project/:projectId" element={<ExportProject />} />
          <Route path="/designer/materials" element={<Materials />} />
          <Route path="/designer/accessories" element={<Accessories />} />
          <Route path="/designer/modules" element={<Modules />} />
          <Route path="/designer/clients" element={<Clients />} />
          <Route path="/designer/exports" element={<Exports />} />
          <Route path="/designer/settings" element={<Settings />} />
          <Route path="/designer/ai-assistant" element={<AiAssistant />} />
          
          {/* Client routes */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/projects" element={<ClientProjects />} />
          <Route path="/client/new-project" element={<ClientNewProject />} />
          <Route path="/client/showroom" element={<ClientShowroom />} />
          <Route path="/client/accessories" element={<ClientAccessories />} />
          <Route path="/client/settings" element={<ClientSettings />} />
          <Route path="/client/ai-assistant" element={<ClientAiAssistant />} />
          <Route path="/client/favorites" element={<ClientFavorites />} />
          <Route path="/client/cart" element={<ClientCart />} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard-new" element={<AdminDashboard2 />} />
          <Route path="/admin/materials-database" element={<AdminMaterials />} />
          <Route path="/admin/accessories" element={<AdminAccessories />} />
          <Route path="/admin/processing" element={<AdminProcessing />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/import-data" element={<AdminImportData />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </UiProvider>
  );
}

export default App;
