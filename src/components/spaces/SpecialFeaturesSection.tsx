
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { SpaceFormType } from './SpaceFormFields';

type SpecialFeaturesSectionProps = {
  form: UseFormReturn<SpaceFormType>;
};

export const SpecialFeaturesSection: React.FC<SpecialFeaturesSectionProps> = ({ form }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Caracteristici speciale</h3>
      
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="includePipe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include țevi</FormLabel>
                <FormDescription>
                  Spațiul conține țevi care trebuie luate în calcul
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="includeFaucets"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include robineți</FormLabel>
                <FormDescription>
                  Spațiul conține robineți care trebuie luați în calcul
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="includeCornice"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include scafă</FormLabel>
                <FormDescription>
                  Spațiul necesită scafă decorativă
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
