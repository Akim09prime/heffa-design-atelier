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
    <div className="min-h-screen flex w-full bg-gray-50 client-theme">
      <SidebarProvider>
        <Sidebar className="bg-white border-r border-gray-100 shadow-lg">
          <SidebarHeader>
            <div className="flex items-center px-4 py-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-green-300/30">
                <span className="font-playfair text-lg font-bold">H</span>
              </div>
              <span className="font-playfair text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">HeffaDesign</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="px-3 py-3">
              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3 px-3 py-1 uppercase text-xs font-medium tracking-wider">Client Platform</Badge>
            </div>
            <nav className="space-y-1 px-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => handleNavigation("/client/dashboard", "Dashboard")}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => handleNavigation("/client/projects", "My Projects")}
              >
                <Layers size={18} />
                <span>My Projects</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => handleNavigation("/client/new-project", "New Project")}
              >
                <FolderPlus size={18} />
                <span>New Project</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => handleNavigation("/client/favorites", "Favorites")}
              >
                <Heart size={18} />
                <span>Favorites</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => handleNavigation("/client/cart", "Cart")}
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => handleNavigation("/client/ai-assistant", "AI Assistant")}
              >
                <MessageCircle size={18} />
                <span>AI Assistant</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => handleNavigation("/client/settings", "Settings")}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Button>
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-4 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-emerald-100">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">
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
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};
