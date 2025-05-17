
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent } from '@/components/ui/card';

const Settings = () => {
  return (
    <DesignerLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Designer Settings</h1>
        <Card>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <p>Designer settings interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default Settings;
