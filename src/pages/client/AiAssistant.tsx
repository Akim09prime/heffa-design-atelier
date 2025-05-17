
import React from 'react';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const AiAssistant = () => {
  return (
    <ClientLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">AI Design Assistant</h1>
        <Card>
          <CardHeader>
            <CardTitle>Design Helper</CardTitle>
            <CardDescription>
              Get help with your furniture design
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-heffa-100 flex items-center justify-center text-heffa-600 mb-4">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Ask Me Anything</h3>
              <p className="text-muted-foreground mb-4">
                I can help you design furniture, suggest materials, calculate dimensions, and solve compatibility issues.
              </p>
              <Button>Start Chatting</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default AiAssistant;
