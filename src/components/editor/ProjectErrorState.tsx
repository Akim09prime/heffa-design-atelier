
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Loader, RefreshCw } from 'lucide-react';
import { useUi } from '@/contexts/UiContext';
import { useTranslation, TranslationProvider } from '@/contexts/TranslationContext';

interface ProjectErrorStateProps {
  error?: Error | string;
  onBack?: () => void;
  onRetry?: () => void;
}

const ProjectErrorStateContent = ({ error, onBack, onRetry }: ProjectErrorStateProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { showToast } = useUi();
  const { t } = useTranslation();
  
  const errorMessage = typeof error === 'string' ? error : error?.message;
  
  const handleBack = async () => {
    if (isNavigating || !onBack) return;
    
    setIsNavigating(true);
    showToast(t('common.navigatingBack'), 'info');
    
    try {
      await onBack();
    } catch (error) {
      console.error('Navigation error:', error);
      showToast(t('common.navigationError'), 'error');
    } finally {
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    }
  };
  
  const handleRetry = async () => {
    if (isRetrying || !onRetry) return;
    
    setIsRetrying(true);
    showToast(t('common.retryingOperation'), 'info');
    
    try {
      await onRetry();
      showToast(t('common.retrySuccessful'), 'success');
    } catch (error) {
      console.error('Retry error:', error);
      showToast(t('common.retryFailed'), 'error', (error as Error)?.message);
    } finally {
      setTimeout(() => {
        setIsRetrying(false);
      }, 500);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <Card className="w-full max-w-md shadow-lg border-red-100">
        <CardHeader className="bg-red-50 border-b border-red-100">
          <CardTitle className="flex items-center text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {t('common.errorOccurred')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-500">
              <AlertTriangle size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {t('project.loadingError')}
              </h3>
              
              <p className="text-sm text-gray-500">
                {errorMessage || t('project.errorDetails')}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-2">
          {onBack && (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleBack}
              disabled={isNavigating || isRetrying}
            >
              {isNavigating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  {t('common.navigating')}
                </>
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.backToProjects')}
                </>
              )}
            </Button>
          )}
          
          {onRetry && (
            <Button
              className="w-full sm:w-auto"
              onClick={handleRetry}
              disabled={isNavigating || isRetrying}
            >
              {isRetrying ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  {t('common.retrying')}
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('common.retry')}
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export const ProjectErrorState = (props: ProjectErrorStateProps) => {
  return (
    <TranslationProvider>
      <ProjectErrorStateContent {...props} />
    </TranslationProvider>
  );
};
