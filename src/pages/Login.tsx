
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-heffa-50 to-heffa-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="md:w-1/2 bg-heffa-600 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-display text-white font-semibold">HeffaDesign</h1>
            <p className="text-heffa-100 mt-2">3D Furniture Configurator</p>
          </div>
          
          <div className="my-8">
            <p className="text-heffa-100 text-lg leading-relaxed">
              Design, configure and price custom furniture with our professional tools.
            </p>
          </div>
          
          <div className="pt-8">
            <p className="text-heffa-100 text-sm">For demo, use:</p>
            <div className="flex flex-col gap-2 mt-2">
              {demoCredentials.map((demo) => (
                <div 
                  key={demo.role} 
                  className="flex items-center gap-2 text-sm bg-heffa-700 bg-opacity-30 p-2 rounded cursor-pointer hover:bg-heffa-700"
                  onClick={() => loginAsDemo(demo.email, demo.password)}
                >
                  <span className="text-heffa-100">• {demo.role}:</span>
                  <span className="text-heffa-200">{demo.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-display font-semibold mb-6 text-heffa-900">Sign in to your account</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-heffa-600 hover:text-heffa-800">
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
                  />
                </div>
                
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-heffa-600 hover:bg-heffa-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
            
            <p className="text-sm text-center mt-6 text-gray-500">
              Don't have an account?{" "}
              <a href="#" className="text-heffa-600 hover:text-heffa-800">
                Request access
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
