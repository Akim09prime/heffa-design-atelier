
import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const LogoutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Could not log out properly",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-gray-700"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
