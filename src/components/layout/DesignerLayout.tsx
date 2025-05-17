
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
  Home, Layers, FolderPlus, Settings, LogOut, 
  User, Users, Palette, Box, Database 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DesignerLayoutProps {
  children: React.ReactNode;
}

export const DesignerLayout: React.FC<DesignerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    // In a real app, we would navigate to different routes
    // For now, we'll just show a toast message
    console.log(`Navigating to ${path}`);
  };

  return (
    <div className="min-h-screen flex w-full bg-designer-50 designer-theme">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-designer-600 flex items-center justify-center text-white mr-2">
                <span className="font-display text-lg">H</span>
              </div>
              <span className="font-display text-lg font-semibold text-designer-800">HeffaDesign</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-1 px-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/dashboard", "Dashboard")}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/projects", "Projects")}
              >
                <Layers size={18} />
                <span>Projects</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/new-project", "New Project")}
              >
                <FolderPlus size={18} />
                <span>New Project</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/clients", "Clients")}
              >
                <Users size={18} />
                <span>Clients</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/materials", "Materials")}
              >
                <Palette size={18} />
                <span>Materials</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/modules", "Modules")}
              >
                <Box size={18} />
                <span>Modules</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => handleNavigation("/settings", "Settings")}
              >
                <Settings size={18} />
                <span>Settings</span>
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
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
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
    </div>
  );
};
