
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LogoutButton from './LogoutButton';
import {
  Home,
  FolderOpen,
  Users,
  Settings,
  Package,
  Grid,
  FileText,
  FileUp,
  FileDown,
  BrainCircuit,
  FlaskConical
} from 'lucide-react';

type SidebarLinkProps = {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  children,
  isActive = false,
}) => (
  <Link to={to} className="w-full block">
    <Button
      variant={isActive ? 'designer' : 'ghost'}
      className={`w-full justify-start mb-1 ${
        isActive ? 'bg-designer-primary/10 text-designer-primary' : 'text-gray-700'
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  </Link>
);

type DesignerLayoutProps = {
  children: React.ReactNode;
};

export const DesignerLayout: React.FC<DesignerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="designer-theme flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold designer-gradient-text">Designer Portal</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <div className="space-y-1 px-3">
            <SidebarLink
              to="/designer"
              icon={Home}
              isActive={path === '/designer' || path === '/designer/'}
            >
              Panou de control
            </SidebarLink>
            <SidebarLink
              to="/designer/projects"
              icon={FolderOpen}
              isActive={path.startsWith('/designer/projects')}
            >
              Proiecte
            </SidebarLink>
            <SidebarLink
              to="/designer/modules"
              icon={Package}
              isActive={path === '/designer/modules'}
            >
              Module
            </SidebarLink>
            <SidebarLink
              to="/designer/materials"
              icon={Grid}
              isActive={path.startsWith('/designer/materials')}
            >
              Materiale
            </SidebarLink>
            <SidebarLink
              to="/designer/accessories"
              icon={Package}
              isActive={path.startsWith('/designer/accessories')}
            >
              Accesorii
            </SidebarLink>
            <SidebarLink
              to="/designer/assistant"
              icon={BrainCircuit}
              isActive={path.startsWith('/designer/assistant')}
            >
              Asistent AI
            </SidebarLink>
          </div>
          <div className="mt-6">
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Management
            </div>
            <div className="mt-2 space-y-1 px-3">
              <SidebarLink
                to="/designer/clients"
                icon={Users}
                isActive={path.startsWith('/designer/clients')}
              >
                Clienți
              </SidebarLink>
              <SidebarLink
                to="/designer/exports"
                icon={FileDown}
                isActive={path.startsWith('/designer/exports')}
              >
                Exporturi
              </SidebarLink>
              <SidebarLink
                to="/designer/import"
                icon={FileUp}
                isActive={path.startsWith('/designer/import')}
              >
                Import
              </SidebarLink>
            </div>
          </div>
          <div className="mt-6">
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Unelte
            </div>
            <div className="mt-2 space-y-1 px-3">
              <SidebarLink
                to="/designer/lab"
                icon={FlaskConical}
                isActive={path.startsWith('/designer/lab')}
              >
                Laborator
              </SidebarLink>
              <SidebarLink
                to="/designer/reports"
                icon={FileText}
                isActive={path.startsWith('/designer/reports')}
              >
                Rapoarte
              </SidebarLink>
            </div>
          </div>
        </div>
        <div className="border-t p-3">
          <div className="space-y-1">
            <SidebarLink
              to="/designer/settings"
              icon={Settings}
              isActive={path.startsWith('/designer/settings')}
            >
              Setări
            </SidebarLink>
            <LogoutButton />
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-designer-bg-primary overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Designer Portal</h1>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="block text-gray-800 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b p-4">
            <div className="space-y-1">
              {/* Mobile menu links */}
              <Link to="/designer" className="block py-2 text-gray-800">Panou de control</Link>
              <Link to="/designer/projects" className="block py-2 text-gray-800">Proiecte</Link>
              <Link to="/designer/modules" className="block py-2 text-gray-800">Module</Link>
              <Link to="/designer/materials" className="block py-2 text-gray-800">Materiale</Link>
              <Link to="/designer/accessories" className="block py-2 text-gray-800">Accesorii</Link>
              <Link to="/designer/assistant" className="block py-2 text-gray-800">Asistent AI</Link>
              <Link to="/designer/clients" className="block py-2 text-gray-800">Clienți</Link>
              <Link to="/designer/exports" className="block py-2 text-gray-800">Exporturi</Link>
              <Link to="/designer/import" className="block py-2 text-gray-800">Import</Link>
              <Link to="/designer/lab" className="block py-2 text-gray-800">Laborator</Link>
              <Link to="/designer/reports" className="block py-2 text-gray-800">Rapoarte</Link>
              <Link to="/designer/settings" className="block py-2 text-gray-800">Setări</Link>
            </div>
          </div>
        )}
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
