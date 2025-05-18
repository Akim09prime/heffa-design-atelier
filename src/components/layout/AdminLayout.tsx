
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
import { Badge } from '@/components/ui/badge';

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
        <Sidebar className="bg-[#131620] border-r border-[#2d3748] shadow-xl">
          <SidebarHeader>
            <div className="flex items-center px-4 py-3 border-b border-[#2d3748]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-500/10">
                <span className="font-display text-lg font-bold">H</span>
              </div>
              <span className="font-display text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-300">HeffaDesign</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="px-3 py-2">
              <Badge className="bg-blue-900/30 text-blue-300 border border-blue-800/50 mb-3">Admin Platform</Badge>
            </div>
            <nav className="space-y-1 px-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/dashboard", t('common.dashboard'))}
              >
                <Home size={18} />
                <span>{t('common.dashboard')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/materials-database", t('common.materials'))}
              >
                <Palette size={18} />
                <span>{t('common.materials')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/accessories", t('common.accessories'))}
              >
                <Box size={18} />
                <span>{t('common.accessories')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/processing", t('common.processing'))}
              >
                <Layers size={18} />
                <span>{t('common.processing')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/users", t('common.users'))}
              >
                <Users size={18} />
                <span>{t('common.users')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/reports", t('common.reports'))}
              >
                <FileSpreadsheet size={18} />
                <span>{t('common.reports')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/import-data", t('common.importData'))}
              >
                <Upload size={18} />
                <span>{t('common.importData')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/analytics", t('common.analytics'))}
              >
                <BarChart size={18} />
                <span>{t('common.analytics')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={() => handleNavigation("/admin/settings", t('common.settings'))}
              >
                <Settings size={18} />
                <span>{t('common.settings')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-gray-300 hover:bg-[#272d3d] hover:text-blue-400"
                onClick={handleLanguageToggle}
              >
                <Globe size={18} />
                <span>{language === 'en' ? 'English' : 'Română'}</span>
              </Button>
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-4 py-3 border-t border-[#2d3748]">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-blue-900/50">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-violet-700">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout} 
                  className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-full"
                >
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
