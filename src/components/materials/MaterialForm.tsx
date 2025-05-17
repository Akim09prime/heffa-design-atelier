
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MaterialType, ProcessingType } from '@/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Define form schema using Zod
const formSchema = z.object({
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.enum(["PAL", "MDF", "MDF-AGT", "PFL", "GLASS", "COUNTERTOP"]),
  thickness: z.coerce.number().min(1, { message: "Thickness must be at least 1mm" }),
  paintable: z.boolean().default(false),
  cantable: z.boolean().default(false),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  pricePerSqm: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  supplier: z.enum(["Egger", "AGT", "SticlaExpert", "Hafele", "Blum", "GTV", "Other"]),
  availability: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface MaterialFormProps {
  material?: {
    id: string;
    code: string;
    name: string;
    type: MaterialType;
    thickness: number;
    paintable: boolean;
    cantable: boolean;
    manufacturer: string;
    pricePerSqm: number;
    supplier: 'Egger' | 'AGT' | 'SticlaExpert' | 'Hafele' | 'Blum' | 'GTV' | 'Other';
    availability: boolean;
    compatibleOperations?: ProcessingType[];
    textureUrl?: string;
    imageUrl?: string;
  };
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  material,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    code: material?.code || '',
    name: material?.name || '',
    type: material?.type || 'PAL',
    thickness: material?.thickness || 18,
    paintable: material?.paintable || false,
    cantable: material?.cantable || false,
    manufacturer: material?.manufacturer || '',
    pricePerSqm: material?.pricePerSqm || 0,
    supplier: material?.supplier || 'Egger',
    availability: material?.availability || true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    toast({
      title: material ? "Material Updated" : "Material Created",
      description: `Successfully ${material ? 'updated' : 'created'} material: ${values.name}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Code</FormLabel>
                <FormControl>
                  <Input placeholder="PAL-W980-ST2-18" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Alb W980 ST2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PAL">PAL</SelectItem>
                    <SelectItem value="MDF">MDF</SelectItem>
                    <SelectItem value="MDF-AGT">MDF-AGT</SelectItem>
                    <SelectItem value="PFL">PFL</SelectItem>
                    <SelectItem value="GLASS">GLASS</SelectItem>
                    <SelectItem value="COUNTERTOP">COUNTERTOP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thickness (mm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Egger" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Egger">Egger</SelectItem>
                    <SelectItem value="AGT">AGT</SelectItem>
                    <SelectItem value="SticlaExpert">SticlaExpert</SelectItem>
                    <SelectItem value="Hafele">Hafele</SelectItem>
                    <SelectItem value="Blum">Blum</SelectItem>
                    <SelectItem value="GTV">GTV</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerSqm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per m²</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="paintable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Paintable</FormLabel>
                    <FormDescription>
                      Can this material be painted?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cantable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Cantable</FormLabel>
                    <FormDescription>
                      Can this material have edge banding?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>In Stock</FormLabel>
                    <FormDescription>
                      Is this material currently available?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {material ? 'Update Material' : 'Create Material'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
