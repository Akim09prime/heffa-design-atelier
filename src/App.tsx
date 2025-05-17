
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import MaterialsDatabase from "./pages/admin/Materials";
import Accessories from "./pages/admin/Accessories";
import Processing from "./pages/admin/Processing";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import ImportData from "./pages/admin/ImportData";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import ClientDashboard from "./pages/client/Dashboard";
import ClientProjects from "./pages/client/Projects";
import ClientNewProject from "./pages/client/NewProject";
import ClientShowroom from "./pages/client/Showroom"; // New showroom page
import ClientFavorites from "./pages/client/Favorites";
import ClientCart from "./pages/client/Cart";
import ClientSettings from "./pages/client/Settings";
import DesignerDashboard from "./pages/designer/Dashboard";
import DesignerProjects from "./pages/designer/Projects";
import DesignerNewProject from "./pages/designer/NewProject";
import DesignerMaterials from "./pages/designer/Materials";
import DesignerAccessories from "./pages/designer/Accessories";
import DesignerModules from "./pages/designer/Modules";
import DesignerClients from "./pages/designer/Clients";
import DesignerExports from "./pages/designer/Exports";
import ExportProject from "./pages/designer/ExportProject";
import DesignerSettings from "./pages/designer/Settings";
import { TranslationProvider } from "./contexts/TranslationContext";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/materials-database" element={<MaterialsDatabase />} />
            <Route path="/admin/accessories" element={<Accessories />} />
            <Route path="/admin/processing" element={<Processing />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/import-data" element={<ImportData />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />
            
            {/* Client Routes */}
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/showroom" element={<ClientShowroom />} />
            <Route path="/client/projects" element={<ClientProjects />} />
            <Route path="/client/projects/new" element={<ClientNewProject />} />
            <Route path="/client/favorites" element={<ClientFavorites />} />
            <Route path="/client/cart" element={<ClientCart />} />
            <Route path="/client/settings" element={<ClientSettings />} />
            
            {/* Designer Routes */}
            <Route path="/designer/dashboard" element={<DesignerDashboard />} />
            <Route path="/designer/projects" element={<DesignerProjects />} />
            <Route path="/designer/projects/new" element={<DesignerNewProject />} />
            <Route path="/designer/materials" element={<DesignerMaterials />} />
            <Route path="/designer/accessories" element={<DesignerAccessories />} />
            <Route path="/designer/modules" element={<DesignerModules />} />
            <Route path="/designer/clients" element={<DesignerClients />} />
            <Route path="/designer/exports" element={<DesignerExports />} />
            <Route path="/designer/exports/:projectId" element={<ExportProject />} />
            <Route path="/designer/settings" element={<DesignerSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </TranslationProvider>
  );
}

export default App;
