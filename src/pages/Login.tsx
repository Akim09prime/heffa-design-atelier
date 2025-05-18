
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Component with access to auth context
const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
      toast({
        title: "Login successful",
        description: "Welcome to HeffaDesign furniture configurator",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials for quick access
  const demoCredentials = [
    { role: 'Client', email: 'client@heffadesign.com', password: 'password' },
    { role: 'Designer', email: 'designer@heffadesign.com', password: 'password' },
    { role: 'Admin', email: 'admin@heffadesign.com', password: 'password' },
  ];

  const loginAsDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-elegant overflow-hidden">
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full"></div>
          <div className="absolute top-1/4 right-12 w-16 h-16 bg-white/10 rounded-full"></div>
          
          <div className="relative">
            <h1 className="text-4xl font-playfair text-white font-bold">HeffaDesign</h1>
            <p className="text-blue-100 mt-2">3D Furniture Configurator</p>
          </div>
          
          <div className="my-8 relative">
            <p className="text-blue-100 text-lg leading-relaxed">
              Design, configure and price custom furniture with our professional tools.
            </p>
          </div>
          
          <div className="pt-8 relative">
            <p className="text-blue-100 text-sm">For demo, use:</p>
            <div className="flex flex-col gap-2 mt-2">
              {demoCredentials.map((demo) => (
                <div 
                  key={demo.role} 
                  className="flex items-center gap-2 text-sm bg-blue-700/30 hover:bg-blue-700/50 transition-colors p-3 rounded-lg cursor-pointer"
                  onClick={() => loginAsDemo(demo.email, demo.password)}
                >
                  <span className="text-blue-100">• {demo.role}:</span>
                  <span className="text-blue-200">{demo.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-playfair font-bold mb-6 text-gray-800">Sign in to your account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-lg"
                />
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg text-base bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
            
            <p className="text-sm text-center mt-7 text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Request access
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Login component - no longer needs AuthProvider wrapper since App.tsx provides it
const Login = () => {
  return <LoginContent />;
};

export default Login;
