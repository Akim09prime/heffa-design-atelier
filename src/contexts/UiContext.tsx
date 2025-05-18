
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { showSuccessToast, showErrorToast, showToast } from '@/utils/toast';

interface UiContextState {
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
  showToast: (title: string, type?: 'default' | 'success' | 'error' | 'warning' | 'info') => void;
  showSuccessToast: (title: string, description?: string) => void;
  showErrorToast: (title: string, description?: string) => void;
  wrapWithLoading: <T>(key: string, promise: Promise<T>) => Promise<T>;
}

const UiContext = createContext<UiContextState | undefined>(undefined);

export const UiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  };
  
  const isLoading = (key: string) => {
    return !!loadingStates[key];
  };
  
  const showToastFn = (title: string, type: 'default' | 'success' | 'error' | 'warning' | 'info' = 'default') => {
    let description: string | undefined;
    
    // Add standard descriptions for certain toast types
    if (type === 'success' && !description) {
      description = 'Operație realizată cu succes';
    } else if (type === 'error' && !description) {
      description = 'A apărut o eroare. Vă rugăm încercați din nou.';
    }
    
    // Log toast event (for analytics in production environment)
    console.log(`Toast: ${type} - ${title}`);
    
    showToast(toast, { title, description, type });
  };
  
  const showSuccessToastFn = (title: string, description?: string) => {
    showSuccessToast(toast, title, description);
  };
  
  const showErrorToastFn = (title: string, description?: string) => {
    showErrorToast(toast, title, description);
  };
  
  const wrapWithLoading = async <T,>(key: string, promise: Promise<T>): Promise<T> => {
    try {
      setLoading(key, true);
      return await promise;
    } finally {
      setLoading(key, false);
    }
  };
  
  const value = {
    loadingStates,
    setLoading,
    isLoading,
    showToast: showToastFn,
    showSuccessToast: showSuccessToastFn,
    showErrorToast: showErrorToastFn,
    wrapWithLoading
  };
  
  return (
    <UiContext.Provider value={value}>
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
};
