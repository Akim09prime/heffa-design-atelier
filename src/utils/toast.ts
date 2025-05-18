
import { useToast } from "@/hooks/use-toast";

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

/**
 * Show toast notification with consistent styling
 * @param toast Toast function from useToast hook
 * @param options Toast options
 */
export const showToast = (
  toast: ReturnType<typeof useToast>['toast'],
  options: ToastOptions
) => {
  const { title, description, type = 'default', duration = 3000 } = options;
  
  // Add icons based on type
  let variant = 'default';
  
  if (type === 'error') {
    variant = 'destructive';
  } else if (type === 'success') {
    // Using default variant with custom styling for success
    variant = 'default';
  }
  
  toast({
    title,
    description,
    variant: variant as any,
    duration,
  });
};

/**
 * Success toast with consistent styling
 * @param toast Toast function from useToast hook
 * @param title Toast title
 * @param description Toast description
 */
export const showSuccessToast = (
  toast: ReturnType<typeof useToast>['toast'],
  title: string,
  description?: string
) => {
  showToast(toast, {
    title,
    description: description || "Operație realizată cu succes",
    type: 'success',
  });
};

/**
 * Error toast with consistent styling
 * @param toast Toast function from useToast hook
 * @param title Toast title
 * @param description Toast description
 */
export const showErrorToast = (
  toast: ReturnType<typeof useToast>['toast'],
  title: string,
  description?: string
) => {
  showToast(toast, {
    title,
    description: description || "A apărut o eroare. Vă rugăm încercați din nou.",
    type: 'error',
    duration: 5000, // Error toasts stay longer
  });
};

/**
 * Info toast with consistent styling
 * @param toast Toast function from useToast hook
 * @param title Toast title
 * @param description Toast description
 */
export const showInfoToast = (
  toast: ReturnType<typeof useToast>['toast'],
  title: string,
  description?: string
) => {
  showToast(toast, {
    title,
    description,
    type: 'info',
  });
};

/**
 * Warning toast with consistent styling
 * @param toast Toast function from useToast hook
 * @param title Toast title
 * @param description Toast description
 */
export const showWarningToast = (
  toast: ReturnType<typeof useToast>['toast'],
  title: string,
  description?: string
) => {
  showToast(toast, {
    title,
    description,
    type: 'warning',
    duration: 4000,
  });
};

/**
 * Action handler with loading state and toast feedback
 * @param actionFn Function to execute
 * @param toast Toast function from useToast hook
 * @param options Toast options
 * @returns Async function with loading state
 */
export const createAsyncActionHandler = (
  actionFn: Function,
  toast: ReturnType<typeof useToast>['toast'],
  options: {
    loadingMessage?: string;
    successTitle: string;
    successDescription?: string;
    errorTitle: string;
    errorDescription?: string;
  }
) => {
  return async (...args: any[]) => {
    // Show loading toast if message is provided
    let loadingToastId;
    if (options.loadingMessage) {
      loadingToastId = toast({
        title: options.loadingMessage,
        description: "Vă rugăm așteptați...",
        duration: Infinity,
      });
    }
    
    try {
      const result = await actionFn(...args);
      
      // Dismiss loading toast if it exists
      if (loadingToastId) {
        toast({
          id: loadingToastId,
          title: options.successTitle,
          description: options.successDescription || "Operație realizată cu succes",
          variant: 'default',
        });
      } else {
        showSuccessToast(toast, options.successTitle, options.successDescription);
      }
      
      return result;
    } catch (error) {
      console.error(error);
      
      // Dismiss loading toast if it exists
      if (loadingToastId) {
        toast({
          id: loadingToastId,
          title: options.errorTitle,
          description: options.errorDescription || (error as Error).message,
          variant: 'destructive',
        });
      } else {
        showErrorToast(toast, options.errorTitle, options.errorDescription || (error as Error).message);
      }
      
      throw error;
    }
  };
};

/**
 * Create a debounced version of a function
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

/**
 * Prevent multiple clicks on the same action
 * @param fn Function to throttle
 * @param delay Delay in milliseconds
 * @returns Throttled function that only executes once within the delay
 */
export const throttleAction = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 1000
): ((...args: Parameters<T>) => Promise<ReturnType<T> | void>) => {
  let isThrottled = false;
  
  return async function(...args: Parameters<T>): Promise<ReturnType<T> | void> {
    if (isThrottled) {
      console.log('Action throttled');
      return;
    }
    
    isThrottled = true;
    
    try {
      return await fn(...args);
    } finally {
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
};
