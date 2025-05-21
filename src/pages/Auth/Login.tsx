
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserRole } from '@/types';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, setUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const showToast = (message: string, type: 'error' | 'success' | 'info') => {
    toast({
      title: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  const isValidLogin = () => {
    if (!email || !password) {
      showToast("Email și parola sunt obligatorii", "error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Adresă de email invalidă", "error");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!isValidLogin() || isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await login(email, password);
      
      // After successful login, set the user role to the selected role
      setUserRole(selectedRole);
      
      showToast("Autentificare reușită ✅", "success");
      
      // Navigate based on the selected role
      switch (selectedRole) {
        case 'admin':
          navigate("/admin/dashboard");
          break;
        case 'designer':
          navigate("/designer/dashboard");
          break;
        case 'client':
          navigate("/client/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Autentificare eșuată ❌", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Login</h1>
            <p className="text-gray-600 mt-2">Autentificare în contul HeffaDesign</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Parola</Label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Ai uitat parola?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol utilizator</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selectează rolul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl shadow-md transition"
              title="Autentificare"
            >
              {isLoggingIn
                ? <Loader className="h-5 w-5 animate-spin" />
                : <span className="h-5 w-5" />}
              {isLoggingIn ? "Se autentifică..." : "Login"}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Nu ai cont?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Înregistrează-te
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
