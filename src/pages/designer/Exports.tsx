
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent } from '@/components/ui/card';

const Exports = () => {
  return (
    <DesignerLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Export Options</h1>
        <Card>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <p>Export management interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default Exports;
