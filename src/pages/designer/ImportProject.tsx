
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProjectService } from '@/services/projectService';

const ImportProject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [importUrl, setImportUrl] = useState<string>('');
  const [importing, setImporting] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    // Get the import URL from location state if available
    if (location.state?.importUrl) {
      setImportUrl(location.state.importUrl);
      handleImport(location.state.importUrl);
    }
  }, [location]);

  const handleImport = async (url: string) => {
    setImporting(true);
    setImportError(null);

    try {
      // Here we'd normally process the import URL
      // For demo purposes, we'll create a new project
      
      // Wait for 2 seconds to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a new project
      const newProject = await ProjectService.createProject({
        userId: '1', // This would be the current user's ID
        name: `Imported Project - ${new Date().toLocaleDateString()}`,
        description: `Project imported from ${url}`,
        type: 'Kitchen',
        parameters: {},
        status: 'draft',
        roomType: 'kitchen',
        modules: [],
        dimensions: {
          width: 4000,
          length: 3000,
          height: 2400,
          walls: []
        }
      });

      toast({
        title: "Import Successful",
        description: `Project has been successfully imported`,
      });

      // Navigate to the new project
      navigate(`/designer/projects/${newProject.id}/3d-editor`);
    } catch (error) {
      console.error("Error importing project:", error);
      setImportError("Failed to import the project. Please check the URL and try again.");
      
      toast({
        title: "Import Failed",
        description: "There was an error importing the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Import Design</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Import Progress</CardTitle>
            <CardDescription>Processing your design import</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            {importing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p>Processing your import...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
              </div>
            ) : importError ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <p className="text-red-600 font-medium">Import Failed</p>
                <p className="text-sm text-center max-w-md">{importError}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => navigate('/designer/projects')}>
                    Back to Projects
                  </Button>
                  <Button onClick={() => handleImport(importUrl)}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <p className="text-green-600 font-medium">Import Completed</p>
                <p className="text-sm text-center">Your design has been successfully imported.</p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => navigate('/designer/projects')}>
                    Go to Projects
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          {!importing && !importError && (
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Note: Imported designs may require additional configuration.
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default ImportProject;
