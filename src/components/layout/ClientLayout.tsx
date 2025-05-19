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
import { Home, Layers, FolderPlus, Settings, LogOut, User, MessageCircle, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
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
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-client-50 to-white client-theme">
      <SidebarProvider>
        <Sidebar className="glass border-r border-white/20 shadow-lg backdrop-blur-md">
          <SidebarHeader>
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-client-primary to-client-accent flex items-center justify-center text-white mr-3 shadow-client-glow">
                <span className="font-poppins text-lg font-bold">H</span>
              </div>
              <span className="font-poppins text-xl font-semibold client-gradient-text">HeffaDesign</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="px-3 py-3">
              <Badge className="bg-client-primary/20 text-client-primary border border-client-primary/30 mb-3 px-3 py-1 uppercase text-xs font-medium tracking-wider">Client Platform</Badge>
            </div>
            <nav className="space-y-1 px-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-client-primary/10 hover:text-client-primary"
                onClick={() => handleNavigation("/client/dashboard", "Dashboard")}
              >
                <Home size={18} />
                <span className="font-medium">Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-client-primary/10 hover:text-client-primary"
                onClick={() => handleNavigation("/client/projects", "My Projects")}
              >
                <Layers size={18} />
                <span>My Projects</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-client-primary/10 hover:text-client-primary"
                onClick={() => handleNavigation("/client/new-project", "New Project")}
              >
                <FolderPlus size={18} />
                <span>New Project</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-client-primary/10 hover:text-client-primary"
                onClick={() => handleNavigation("/client/favorites", "Favorites")}
              >
                <Heart size={18} />
                <span>Favorites</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-client-primary/10 hover:text-client-primary"
                onClick={() => handleNavigation("/client/cart", "Cart")}
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-client-primary/10 hover:text-client-primary"
                onClick={() => handleNavigation("/client/ai-assistant", "AI Assistant")}
              >
                <MessageCircle size={18} />
                <span>AI Assistant</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-client-primary/10 hover:text-client-primary"
                onClick={() => handleNavigation("/client/settings", "Settings")}
              >
                <Settings size={18} />
                <span className="font-medium">Settings</span>
              </Button>
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-4 py-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-client-primary/20 ring-2 ring-white/50">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-client-primary to-client-accent text-white">
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
                  className="hover:bg-red-50 hover:text-red-600 rounded-full"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-client-50 to-white">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};
