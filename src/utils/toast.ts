
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
  
  toast({
    title,
    description,
    variant: type === 'error' ? 'destructive' : 'default',
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
    description,
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
    description,
    type: 'error',
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
    successTitle: string;
    successDescription?: string;
    errorTitle: string;
    errorDescription?: string;
  }
) => {
  return async (...args: any[]) => {
    try {
      const result = await actionFn(...args);
      showSuccessToast(toast, options.successTitle, options.successDescription);
      return result;
    } catch (error) {
      console.error(error);
      showErrorToast(toast, options.errorTitle, options.errorDescription || (error as Error).message);
      throw error;
    }
  };
};
