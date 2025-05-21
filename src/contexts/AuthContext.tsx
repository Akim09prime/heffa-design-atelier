
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppMode } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  appMode: AppMode;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserRole: (role: UserRole) => void; // For demo purposes only
  setAppMode: (mode: AppMode) => void; // For toggling between configurator and showroom
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data for demonstration
const demoUsers: Record<UserRole, User> = {
  client: {
    id: '1',
    name: 'John Client',
    email: 'client@heffadesign.com',
    role: 'client',
    avatar: '/avatar-client.jpg',
    active: true,
    projectIds: ['1', '2']
  },
  designer: {
    id: '2',
    name: 'Diana Designer',
    email: 'designer@heffadesign.com',
    role: 'designer',
    avatar: '/avatar-designer.jpg',
    active: true,
    projectIds: ['1', '3', '4']
  },
  admin: {
    id: '3',
    name: 'Adam Admin',
    email: 'admin@heffadesign.com',
    role: 'admin',
    avatar: '/avatar-admin.jpg',
    active: true
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appMode, setAppMode] = useState<AppMode>('configurator');

  useEffect(() => {
    // Check for saved user in localStorage (demo only)
    const savedUser = localStorage.getItem('heffaUser');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Check for saved app mode
    const savedMode = localStorage.getItem('heffaAppMode');
    if (savedMode && (savedMode === 'configurator' || savedMode === 'showroom')) {
      setAppMode(savedMode as AppMode);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Demo authentication - in a real app this would validate against a backend
      // For demo purposes, we'll allow any email to log in, and the role will be set separately
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll use client as default user
      // The actual role will be set by the setUserRole function after login
      setUser(demoUsers.client);
      localStorage.setItem('heffaUser', JSON.stringify(demoUsers.client));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Demo registration - in a real app this would register in a backend
      const lowerEmail = email.toLowerCase();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new user object 
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email: email,
        role: 'designer', // Default role for new registrations
        avatar: '/avatar-default.jpg',
        active: true,
        projectIds: []
      };
      
      setUser(newUser);
      localStorage.setItem('heffaUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('heffaUser');
    // Do not reset app mode on logout to maintain user preference
  };

  // Set user role function - now properly updates the user object with the selected role
  const setUserRole = (role: UserRole) => {
    const demoUser = demoUsers[role];
    setUser(demoUser);
    localStorage.setItem('heffaUser', JSON.stringify(demoUser));
  };

  // Toggle between configurator and showroom modes
  const handleSetAppMode = (mode: AppMode) => {
    setAppMode(mode);
    localStorage.setItem('heffaAppMode', mode);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register,
        logout, 
        setUserRole, 
        appMode, 
        setAppMode: handleSetAppMode 
      }}
    >
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
