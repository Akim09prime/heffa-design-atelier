
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent } from '@/components/ui/card';

const AiAssistant = () => {
  return (
    <DesignerLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">AI Design Assistant</h1>
        <Card>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <p>AI assistant interface for designers will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default AiAssistant;
