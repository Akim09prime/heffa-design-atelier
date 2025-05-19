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
import { useTranslation, TranslationProvider } from '@/contexts/TranslationContext';
import { Badge } from '@/components/ui/badge';
import { UiProvider } from '@/contexts/UiContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Create the internal component that uses hooks
const AdminLayoutContent: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language, changeLanguage } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        variant: "default"
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out",
        variant: "destructive"
      });
    }
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
    <UiProvider>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 admin-theme">
        <SidebarProvider>
          <Sidebar className="glass border-r border-white/20 shadow-lg backdrop-blur-md">
            <SidebarHeader>
              <div className="flex items-center px-4 py-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-admin-primary to-admin-accent flex items-center justify-center text-white mr-3 shadow-admin-glow">
                  <span className="font-poppins text-lg font-bold">H</span>
                </div>
                <span className="font-poppins text-xl font-semibold admin-gradient-text">HeffaDesign</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <div className="px-3 py-3">
                <Badge className="bg-admin-primary/20 text-admin-primary border border-admin-primary/30 mb-3 px-3 py-1 uppercase text-xs font-medium tracking-wider">Admin Platform</Badge>
              </div>
              <nav className="space-y-1 px-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/dashboard", t('common.dashboard'))}
                >
                  <Home size={18} />
                  <span className="font-medium">{t('common.dashboard')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/materials-database", t('common.materials'))}
                >
                  <Palette size={18} />
                  <span>{t('common.materials')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/accessories", t('common.accessories'))}
                >
                  <Box size={18} />
                  <span>{t('common.accessories')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/processing", t('common.processing'))}
                >
                  <Layers size={18} />
                  <span>{t('common.processing')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/users", t('common.users'))}
                >
                  <Users size={18} />
                  <span>{t('common.users')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/reports", t('common.reports'))}
                >
                  <FileSpreadsheet size={18} />
                  <span>{t('common.reports')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/import-data", t('common.importData'))}
                >
                  <Upload size={18} />
                  <span>{t('common.importData')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/analytics", t('common.analytics'))}
                >
                  <BarChart size={18} />
                  <span>{t('common.analytics')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={() => handleNavigation("/admin/settings", t('common.settings'))}
                >
                  <Settings size={18} />
                  <span>{t('common.settings')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-admin-primary/10 hover:text-admin-primary"
                  onClick={handleLanguageToggle}
                >
                  <Globe size={18} />
                  <span className="font-medium">{language === 'en' ? 'English' : 'Română'}</span>
                </Button>
              </nav>
            </SidebarContent>
            <SidebarFooter>
              <div className="px-4 py-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-admin-primary/20 ring-2 ring-white/50">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-admin-primary to-admin-accent text-white">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout} 
                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            {children}
          </main>
        </SidebarProvider>
        
        {/* Add AI Assistant */}
        <AiAssistant />
      </div>
    </UiProvider>
  );
};

// Export the wrapper component that provides the translation context
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <TranslationProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </TranslationProvider>
  );
};
