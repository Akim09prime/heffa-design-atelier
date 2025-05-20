
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Schema for the space form
export const spaceFormSchema = z.object({
  name: z.string().min(3, { message: "Numele trebuie să aibă cel puțin 3 caractere" }),
  width: z.number().min(500, { message: "Lățimea minimă este 500mm" }).max(10000, { message: "Lățimea maximă este 10000mm" }),
  height: z.number().min(500, { message: "Înălțimea minimă este 500mm" }).max(5000, { message: "Înălțimea maximă este 5000mm" }),
  depth: z.number().min(100, { message: "Adâncimea minimă este 100mm" }).max(2000, { message: "Adâncimea maximă este 2000mm" }),
  includePipe: z.boolean().default(false),
  includeFaucets: z.boolean().default(false),
  includeCornice: z.boolean().default(false),
});

export type SpaceFormType = z.infer<typeof spaceFormSchema>;

type SpaceFormFieldsProps = {
  form: UseFormReturn<SpaceFormType>;
};

export const SpaceFormFields: React.FC<SpaceFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nume spațiu</FormLabel>
            <FormControl>
              <Input placeholder="ex: Bucătărie, Dormitor..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lățime (mm)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Înălțime (mm)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adâncime (mm)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
