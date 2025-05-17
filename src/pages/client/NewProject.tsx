
import React from 'react';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NewProject = () => {
  return (
    <ClientLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Create New Project</h1>
        <Card>
          <CardHeader>
            <CardTitle>New Furniture Project</CardTitle>
            <CardDescription>
              Start designing your custom furniture
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <div>
              <p className="text-muted-foreground mb-4">
                Here you will be able to configure your room dimensions and select furniture modules.
              </p>
              <Button>Start Configuration</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default NewProject;
