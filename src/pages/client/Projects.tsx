
import React from 'react';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Projects = () => {
  return (
    <ClientLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">My Projects</h1>
        <Card>
          <CardHeader>
            <CardTitle>Projects List</CardTitle>
            <CardDescription>
              This is where your saved furniture projects will appear.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <div>
              <p className="text-muted-foreground mb-4">
                This section will display your projects with filtering and sorting options.
              </p>
              <Button>Create New Project</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Projects;
