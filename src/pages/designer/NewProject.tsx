
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent } from '@/components/ui/card';

const NewProject = () => {
  return (
    <DesignerLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Create New Project</h1>
        <Card>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <p>New project creation form will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default NewProject;
