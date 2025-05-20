
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Package, 
  Factory, 
  Users, 
  FileText, 
  Upload, 
  BarChart3, 
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LogoutButton from './LogoutButton';

type MenuItem = {
  title: string;
  icon: React.ElementType;
  path: string;
  translationKey: string;
};

const adminMenu: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
    translationKey: 'admin.menu.dashboard'
  },
  {
    title: 'Baza de date materiale',
    icon: Database,
    path: '/admin/materials-database',
    translationKey: 'admin.menu.materials'
  },
  {
    title: 'Accesorii',
    icon: Package,
    path: '/admin/accessories',
    translationKey: 'admin.menu.accessories'
  },
  {
    title: 'Planificare producție',
    icon: Factory,
    path: '/admin/processing',
    translationKey: 'admin.menu.production'
  },
  {
    title: 'Utilizatori',
    icon: Users,
    path: '/admin/users',
    translationKey: 'admin.menu.users'
  },
  {
    title: 'Rapoarte',
    icon: FileText,
    path: '/admin/reports',
    translationKey: 'admin.menu.reports'
  },
  {
    title: 'Import date',
    icon: Upload,
    path: '/admin/import-data',
    translationKey: 'admin.menu.importData'
  },
  {
    title: 'Analiză',
    icon: BarChart3,
    path: '/admin/analytics',
    translationKey: 'admin.menu.analytics'
  },
  {
    title: 'Setări',
    icon: Settings,
    path: '/admin/settings',
    translationKey: 'admin.menu.settings'
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="admin-theme flex min-h-screen bg-admin-bg-primary">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-admin-bg-secondary border-r border-admin-border-light transition-all duration-300 ease-in-out overflow-hidden",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-4 border-b border-admin-border-light">
          <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
            {!collapsed && (
              <span className="text-xl font-bold text-white">Admin Panel</span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "p-1 ml-auto text-admin-text-muted hover:text-white",
                collapsed && "mx-auto"
              )}
            >
              {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {/* Sidebar menu */}
        <div className="py-4">
          {adminMenu.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center px-4 py-2 mb-1 mx-2 rounded-lg transition-all",
                location.pathname === item.path 
                  ? "bg-admin-accent-blue/20 text-admin-accent-blue" 
                  : "text-admin-text-secondary hover:bg-admin-bg-tertiary hover:text-white",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("animate-icon h-5 w-5", collapsed ? "" : "mr-3")} />
              {!collapsed && <span>{t(item.translationKey)}</span>}
            </Link>
          ))}
        </div>

        {/* Logout button at bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-admin-border-light">
          {collapsed ? (
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full flex justify-center hover:bg-admin-accent-blue/10 text-admin-text-muted hover:text-white"
              onClick={() => setCollapsed(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
