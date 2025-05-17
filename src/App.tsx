
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Login from "./pages/Login";
import ClientDashboard from "./pages/client/Dashboard";
import DesignerDashboard from "./pages/designer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

// Lazy load the other pages
import { lazy, Suspense } from "react";

// Client pages
const ClientProjects = lazy(() => import("./pages/client/Projects"));
const ClientNewProject = lazy(() => import("./pages/client/NewProject"));
const ClientFavorites = lazy(() => import("./pages/client/Favorites"));
const ClientCart = lazy(() => import("./pages/client/Cart"));
const ClientAiAssistant = lazy(() => import("./pages/client/AiAssistant"));
const ClientSettings = lazy(() => import("./pages/client/Settings"));

// Designer pages
const DesignerProjects = lazy(() => import("./pages/designer/Projects"));
const DesignerNewProject = lazy(() => import("./pages/designer/NewProject"));
const DesignerClients = lazy(() => import("./pages/designer/Clients"));
const DesignerMaterials = lazy(() => import("./pages/designer/Materials"));
const DesignerModules = lazy(() => import("./pages/designer/Modules"));
const DesignerAccessories = lazy(() => import("./pages/designer/Accessories"));
const DesignerExports = lazy(() => import("./pages/designer/Exports"));
const DesignerAiAssistant = lazy(() => import("./pages/designer/AiAssistant"));
const DesignerSettings = lazy(() => import("./pages/designer/Settings"));

// Admin pages
const AdminMaterials = lazy(() => import("./pages/admin/Materials"));
const AdminAccessories = lazy(() => import("./pages/admin/Accessories"));
const AdminProcessing = lazy(() => import("./pages/admin/Processing"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminImportData = lazy(() => import("./pages/admin/ImportData"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

const queryClient = new QueryClient();

// Loading component
const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center min-h-[200px]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Role-based routing
  if (user.role === "client") {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/projects" element={<ClientProjects />} />
          <Route path="/client/new-project" element={<ClientNewProject />} />
          <Route path="/client/favorites" element={<ClientFavorites />} />
          <Route path="/client/cart" element={<ClientCart />} />
          <Route path="/client/ai-assistant" element={<ClientAiAssistant />} />
          <Route path="/client/settings" element={<ClientSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  } else if (user.role === "designer") {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/designer/dashboard" replace />} />
          <Route path="/designer/dashboard" element={<DesignerDashboard />} />
          <Route path="/designer/projects" element={<DesignerProjects />} />
          <Route path="/designer/new-project" element={<DesignerNewProject />} />
          <Route path="/designer/clients" element={<DesignerClients />} />
          <Route path="/designer/materials" element={<DesignerMaterials />} />
          <Route path="/designer/modules" element={<DesignerModules />} />
          <Route path="/designer/accessories" element={<DesignerAccessories />} />
          <Route path="/designer/exports" element={<DesignerExports />} />
          <Route path="/designer/ai-assistant" element={<DesignerAiAssistant />} />
          <Route path="/designer/settings" element={<DesignerSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  } else if (user.role === "admin") {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/materials-database" element={<AdminMaterials />} />
          <Route path="/admin/accessories" element={<AdminAccessories />} />
          <Route path="/admin/processing" element={<AdminProcessing />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/import-data" element={<AdminImportData />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  }

  return <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
