
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  PackageOpen, 
  Factory, 
  Users, 
  FileBarChart2, 
  FileInput, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const location = useLocation();
  
  const handleLogout = () => {
    // Implementation of logout functionality would go here
    // For now, just redirect to login
    window.location.href = '/login';
  };

  const menuItems = [
    { 
      title: t('admin.menu.dashboard'), 
      path: '/admin/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.materials'), 
      path: '/admin/materials', 
      icon: <Database className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.accessories'), 
      path: '/admin/accessories', 
      icon: <PackageOpen className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.production'), 
      path: '/admin/processing', 
      icon: <Factory className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.users'), 
      path: '/admin/users', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.reports'), 
      path: '/admin/reports', 
      icon: <FileBarChart2 className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.importData'), 
      path: '/admin/import', 
      icon: <FileInput className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.analytics'), 
      path: '/admin/analytics', 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      title: t('admin.menu.settings'), 
      path: '/admin/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="admin-sidebar w-64 flex-shrink-0 hidden md:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-4 flex items-center h-16 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-white hover:bg-gray-700 rounded-md group transition-all duration-200 ${
                      location.pathname === item.path ? 'bg-gray-700' : ''
                    }`}
                  >
                    <span className="animate-icon mr-3">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Logout button */}
          <div className="px-4 py-4 border-t border-gray-700">
            <button
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center px-4 py-2 w-full text-white hover:bg-gray-700 rounded-md transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-admin-bg-secondary text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <button className="block text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('auth.logoutConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('auth.logoutConfirmMessage')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>{t('common.logout')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
