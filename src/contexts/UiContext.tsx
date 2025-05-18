
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { showSuccessToast, showErrorToast, showToast, showInfoToast, showWarningToast, throttleAction } from '@/utils/toast';

interface UiContextState {
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
  showToast: (title: string, type?: 'default' | 'success' | 'error' | 'warning' | 'info', description?: string) => void;
  showSuccessToast: (title: string, description?: string) => void;
  showErrorToast: (title: string, description?: string) => void;
  showInfoToast: (title: string, description?: string) => void;
  showWarningToast: (title: string, description?: string) => void;
  wrapWithLoading: <T>(key: string, promise: Promise<T>) => Promise<T>;
  confirmAction: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  protectAction: <T extends (...args: any[]) => any>(fn: T, delay?: number) => (...args: Parameters<T>) => Promise<ReturnType<T> | void>;
}

const UiContext = createContext<UiContextState | undefined>(undefined);

export const UiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });
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
  
  const showToastFn = (title: string, type: 'default' | 'success' | 'error' | 'warning' | 'info' = 'default', description?: string) => {
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
  
  const showInfoToastFn = (title: string, description?: string) => {
    showInfoToast(toast, title, description);
  };
  
  const showWarningToastFn = (title: string, description?: string) => {
    showWarningToast(toast, title, description);
  };
  
  const wrapWithLoading = async <T,>(key: string, promise: Promise<T>): Promise<T> => {
    try {
      setLoading(key, true);
      return await promise;
    } finally {
      setLoading(key, false);
    }
  };
  
  const confirmAction = (message: string, onConfirm: () => void, onCancel?: () => void) => {
    // In a production app, this would open a confirmation dialog
    // For now, we'll use the browser's native confirm
    if (window.confirm(message)) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  };
  
  const protectAction = <T extends (...args: any[]) => any>(
    fn: T, 
    delay: number = 1000
  ): ((...args: Parameters<T>) => Promise<ReturnType<T> | void>) => {
    return throttleAction(fn, delay);
  };
  
  const value = {
    loadingStates,
    setLoading,
    isLoading,
    showToast: showToastFn,
    showSuccessToast: showSuccessToastFn,
    showErrorToast: showErrorToastFn,
    showInfoToast: showInfoToastFn,
    showWarningToast: showWarningToastFn,
    wrapWithLoading,
    confirmAction,
    protectAction
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
