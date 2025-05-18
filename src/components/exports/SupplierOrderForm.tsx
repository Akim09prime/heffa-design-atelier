
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Project } from '@/types';
import { ExportService } from '@/services/exportService';
import { Download, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface SupplierOrderFormProps {
  project: Project;
  onOrderSubmitted?: () => void;
}

interface OrderFormValues {
  supplierType: string;
  recipientEmail?: string;
}

export const SupplierOrderForm: React.FC<SupplierOrderFormProps> = ({ project, onOrderSubmitted }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [orderData, setOrderData] = useState<Record<string, any> | null>(null);
  const [showEmailField, setShowEmailField] = useState(false);

  const form = useForm<OrderFormValues>({
    defaultValues: {
      supplierType: 'PAL',
      recipientEmail: '',
    },
  });

  const handleGenerate = async (values: OrderFormValues) => {
    setIsGenerating(true);
    try {
      const data = await ExportService.generateSupplierOrder(project, values.supplierType);
      setOrderData(data);
      
      toast({
        title: "Order generated",
        description: `Order for ${values.supplierType} supplier has been generated`,
      });
      
      if (showEmailField && values.recipientEmail) {
        // In a real app, this would use a separate email function
        toast({
          title: "Order sent",
          description: `Order has been sent to ${values.recipientEmail}`,
        });
      }
      
      // Call onOrderSubmitted if provided
      if (onOrderSubmitted) {
        onOrderSubmitted();
      }
    } catch (error) {
      console.error('Order generation error:', error);
      toast({
        title: "Generation failed",
        description: "There was an error creating the supplier order",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Supplier Order</CardTitle>
        <CardDescription>
          Create orders for materials, accessories, or processing services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
            <FormField
              control={form.control}
              name="supplierType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAL">PAL Material Supplier</SelectItem>
                      <SelectItem value="accessories">Accessories Supplier</SelectItem>
                      <SelectItem value="glass">Glass Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of supplier to generate an order for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendEmail"
                checked={showEmailField}
                onChange={() => setShowEmailField(!showEmailField)}
                className="rounded border-gray-300"
              />
              <label
                htmlFor="sendEmail"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email this order to supplier
              </label>
            </div>

            {showEmailField && (
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Email</FormLabel>
                    <FormControl>
                      <Input placeholder="supplier@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the email address of the supplier.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button 
              type="submit" 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : showEmailField ? (
                <>
                  <Send className="h-4 w-4" /> Send to Supplier
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Generate Order
                </>
              )}
            </Button>
          </form>
        </Form>

        {orderData && (
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Order Details</h3>
            <pre className="overflow-auto text-sm p-2 bg-gray-100 rounded border max-h-80">
              {JSON.stringify(orderData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {orderData && (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Download as PDF
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
