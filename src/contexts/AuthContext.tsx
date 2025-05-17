
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserRole: (role: UserRole) => void; // For demo purposes only
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data for demonstration
const demoUsers: Record<UserRole, User> = {
  client: {
    id: '1',
    name: 'John Client',
    email: 'client@heffadesign.com',
    role: 'client',
    avatar: '/avatar-client.jpg'
  },
  designer: {
    id: '2',
    name: 'Diana Designer',
    email: 'designer@heffadesign.com',
    role: 'designer',
    avatar: '/avatar-designer.jpg'
  },
  admin: {
    id: '3',
    name: 'Adam Admin',
    email: 'admin@heffadesign.com',
    role: 'admin',
    avatar: '/avatar-admin.jpg'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage (demo only)
    const savedUser = localStorage.getItem('heffaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Demo authentication - in a real app this would validate against a backend
      const lowerEmail = email.toLowerCase();
      
      let role: UserRole | undefined;
      if (lowerEmail.includes('client')) role = 'client';
      else if (lowerEmail.includes('designer')) role = 'designer';
      else if (lowerEmail.includes('admin')) role = 'admin';
      
      if (!role) {
        throw new Error('Invalid credentials');
      }
      
      const demoUser = demoUsers[role];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(demoUser);
      localStorage.setItem('heffaUser', JSON.stringify(demoUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('heffaUser');
  };

  // For demo purposes only - allows switching between user roles
  const setUserRole = (role: UserRole) => {
    const demoUser = demoUsers[role];
    setUser(demoUser);
    localStorage.setItem('heffaUser', JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
