
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const showToast = (message: string, type: 'error' | 'success' | 'info') => {
    toast({
      title: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  const isValidRegister = () => {
    if (!email || !password || !confirmPassword) {
      showToast("Toate câmpurile sunt obligatorii", "error");
      return false;
    }
    if (password !== confirmPassword) {
      showToast("Parolele nu se potrivesc", "error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Adresă de email invalidă", "error");
      return false;
    }
    if (password.length < 6) {
      showToast("Parola trebuie să aibă minim 6 caractere", "error");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!isValidRegister() || isRegistering) return;
    setIsRegistering(true);
    try {
      await register(email, password);
      showToast("Cont creat cu succes ✅", "success");
      navigate("/designer/dashboard");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Înregistrare eșuată ❌", "error");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Register</h1>
            <p className="text-gray-600 mt-2">Creează un cont HeffaDesign</p>
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
              <Label htmlFor="password">Parola</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmă parola</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className="flex items-center justify-center w-full gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl shadow-md transition"
              title="Înregistrare"
            >
              {isRegistering
                ? <Loader className="h-5 w-5 animate-spin" />
                : <UserPlus className="h-5 w-5" />}
              {isRegistering ? "Se înregistrează..." : "Register"}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Ai deja cont?{" "}
                <a
                  href="/login"
                  className="text-green-600 hover:text-green-800 hover:underline"
                >
                  Autentifică-te
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
