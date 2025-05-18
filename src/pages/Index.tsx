
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthProvider } from '../contexts/AuthContext';

const IndexContent = () => {
  const { user, appMode, setAppMode } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Delay to show loading spinner a bit longer for demo purposes
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleModeChange = (value: string) => {
    setAppMode(value as 'configurator' | 'showroom');
  };

  const navigateBasedOnRole = () => {
    if (!user) return;

    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'designer':
        navigate('/designer/dashboard');
        break;
      case 'client':
        // For clients, check the app mode
        if (appMode === 'configurator') {
          navigate('/client/dashboard');
        } else { // showroom mode
          navigate('/client/showroom');
        }
        break;
      default:
        navigate('/login');
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // For clients only - show mode selection
  if (user.role === 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-heffa-50 to-heffa-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Bun venit în HeffaDesign</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={appMode} 
              onValueChange={handleModeChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="configurator">Configurator Mode</TabsTrigger>
                <TabsTrigger value="showroom">Showroom Mode</TabsTrigger>
              </TabsList>
              
              <TabsContent value="configurator" className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Configurator Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Build your furniture project from scratch with complete customization options.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1593005510329-8a4035a7238f?q=80&w=1470&auto=format&fit=crop" 
                    alt="Configurator" 
                    className="rounded-md mt-4 w-full h-40 object-cover"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="showroom" className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Showroom Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse our catalog of predefined furniture projects and order directly.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1581661701347-6e695ee9c1fc?q=80&w=1471&auto=format&fit=crop" 
                    alt="Showroom" 
                    className="rounded-md mt-4 w-full h-40 object-cover"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <Button 
              className="w-full mt-6 bg-heffa-600 hover:bg-heffa-700"
              onClick={navigateBasedOnRole}
            >
              Continuă
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For other roles, redirect directly
  navigateBasedOnRole();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

// Main Index component wrapped with AuthProvider
const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;
