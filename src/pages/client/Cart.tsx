
import React from 'react';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Cart = () => {
  return (
    <ClientLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Shopping Cart</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
            <CardDescription>
              Furniture items in your cart
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <div>
              <p className="text-muted-foreground mb-4">
                Items added to your cart will be displayed here for quotation or order.
              </p>
              <Button>Request Quote</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Cart;
