
import React from 'react';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  return (
    <ClientLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Favorites</h1>
        <Card>
          <CardHeader>
            <CardTitle>Favorite Designs</CardTitle>
            <CardDescription>
              Your saved favorite furniture designs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <div>
              <p className="text-muted-foreground mb-4">
                Furniture modules and designs you've marked as favorites will appear here.
              </p>
              <Button>Browse Catalog</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Favorites;
