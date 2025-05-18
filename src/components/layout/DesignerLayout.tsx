
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
  Home, Box, Settings, LogOut, User, Users, 
  FileSpreadsheet, FolderPlus, Folder, Palette, Download, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AiAssistant } from '@/components/ai/AiAssistant';
import { useTranslation } from '@/contexts/TranslationContext';
import { Badge } from '@/components/ui/badge';

interface DesignerLayoutProps {
  children: React.ReactNode;
}

export const DesignerLayout: React.FC<DesignerLayoutProps> = ({ children }) => {
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
      description: t('settings.languageSetTo'),
    });
  };

  return (
    <div className="min-h-screen flex w-full designer-area">
      <SidebarProvider>
        <Sidebar className="bg-white border-r border-gray-200 shadow-lg">
          <SidebarHeader>
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-300/30">
                <span className="font-display text-lg font-bold">H</span>
              </div>
              <span className="font-display text-lg font-semibold gradient-text">HeffaDesign</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="px-3 py-2">
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200 mb-3">Designer Platform</Badge>
            </div>
            <nav className="space-y-1 px-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/dashboard", t('common.dashboard'))}
              >
                <Home size={18} />
                <span>{t('common.dashboard')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/projects", "Projects")}
              >
                <Folder size={18} />
                <span>Projects</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/projects/new", "New Project")}
              >
                <FolderPlus size={18} />
                <span>New Project</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/materials", t('common.materials'))}
              >
                <Palette size={18} />
                <span>{t('common.materials')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/accessories", t('common.accessories'))}
              >
                <Box size={18} />
                <span>{t('common.accessories')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/modules", "Modules")}
              >
                <FileSpreadsheet size={18} />
                <span>Modules</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/clients", "Clients")}
              >
                <Users size={18} />
                <span>Clients</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/exports", "Exports")}
              >
                <Download size={18} />
                <span>Exports</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => handleNavigation("/designer/settings", t('common.settings'))}
              >
                <Settings size={18} />
                <span>{t('common.settings')}</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600"
                onClick={handleLanguageToggle}
              >
                <Globe size={18} />
                <span>{language === 'en' ? 'English' : 'Română'}</span>
              </Button>
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-blue-100">
                  {/* Using User icon as fallback by default instead of trying to load potentially missing image */}
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 rounded-full"
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
