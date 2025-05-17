
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarProvider 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, Layers, Settings, LogOut, User, Users, 
  Database, FileSpreadsheet, Upload, BarChart, Palette, Box, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AiAssistant } from '@/components/ai/AiAssistant';
import { useTranslation } from '@/contexts/TranslationContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language, changeLanguage } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleNavigation = (path: string, title: string) => {
    toast({
      title: `Navigating to ${title}`,
      description: "Loading content...",
    });
    console.log(`Navigating to ${path}`);
    navigate(path);
  };
  
  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'ro' : 'en';
    changeLanguage(newLanguage);
    toast({
      title: t('settings.languageChanged'),
      description: language === 'en' ? t('settings.languageSetTo.ro') : t('settings.languageSetTo.en'),
    });
  };

  return (
    <div className="flex w-full min-h-screen bg-admin-950 admin-theme">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                <span className="font-display text-lg">H</span>
              </div>
              <span className="font-display text-lg font-semibold text-white">HeffaDesign</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-1 px-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/dashboard", t('common.dashboard'))}
              >
                <Home size={18} />
                <span>{t('common.dashboard')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/materials-database", t('common.materials'))}
              >
                <Palette size={18} />
                <span>{t('common.materials')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/accessories", t('common.accessories'))}
              >
                <Box size={18} />
                <span>{t('common.accessories')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/processing", t('common.processing'))}
              >
                <Layers size={18} />
                <span>{t('common.processing')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/users", t('common.users'))}
              >
                <Users size={18} />
                <span>{t('common.users')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/reports", t('common.reports'))}
              >
                <FileSpreadsheet size={18} />
                <span>{t('common.reports')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/import-data", t('common.importData'))}
              >
                <Upload size={18} />
                <span>{t('common.importData')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/analytics", t('common.analytics'))}
              >
                <BarChart size={18} />
                <span>{t('common.analytics')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/admin/settings", t('common.settings'))}
              >
                <Settings size={18} />
                <span>{t('common.settings')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={handleLanguageToggle}
              >
                <Globe size={18} />
                <span>{language === 'en' ? 'English' : 'Română'}</span>
              </Button>
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-white">
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarProvider>
      
      {/* Add AI Assistant */}
      <AiAssistant />
    </div>
  );
};
