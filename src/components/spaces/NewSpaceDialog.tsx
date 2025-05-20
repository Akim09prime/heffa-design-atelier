import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Space } from '@/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Schema de validare pentru formularul de spațiu
const spaceFormSchema = z.object({
  name: z.string().min(3, { message: "Numele trebuie să aibă cel puțin 3 caractere" }),
  width: z.number().min(500, { message: "Lățimea minimă este 500mm" }).max(10000, { message: "Lățimea maximă este 10000mm" }),
  height: z.number().min(500, { message: "Înălțimea minimă este 500mm" }).max(5000, { message: "Înălțimea maximă este 5000mm" }),
  depth: z.number().min(100, { message: "Adâncimea minimă este 100mm" }).max(2000, { message: "Adâncimea maximă este 2000mm" }),
  includePipe: z.boolean().default(false),
  includeFaucets: z.boolean().default(false),
  includeCornice: z.boolean().default(false),
});

type SpaceFormType = z.infer<typeof spaceFormSchema>;

type NewSpaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSpaceCreated: (space: Omit<Space, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => void;
};

export const NewSpaceDialog: React.FC<NewSpaceDialogProps> = ({
  open,
  onOpenChange,
  onSpaceCreated
}) => {
  const form = useForm<SpaceFormType>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: {
      name: '',
      width: 3000,
      height: 2400,
      depth: 600,
      includePipe: false,
      includeFaucets: false,
      includeCornice: false,
    }
  });

  const onSubmit = (data: SpaceFormType) => {
    // Make sure all required fields are explicitly included
    const spaceData: Omit<Space, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> = {
      name: data.name,
      width: data.width,
      height: data.height,
      depth: data.depth,
      includePipe: data.includePipe,
      includeFaucets: data.includeFaucets,
      includeCornice: data.includeCornice,
    };
    
    onSpaceCreated(spaceData);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="designer-gradient-text">Adăugare spațiu nou</DialogTitle>
          <DialogDescription>
            Completează detaliile spațiului pe care vrei să îl adaugi la proiect.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <DialogFooter>
              <Button type="submit">Adaugă spațiu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
