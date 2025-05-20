
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Space } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { SpaceFormFields, spaceFormSchema, SpaceFormType } from './SpaceFormFields';
import { SpecialFeaturesSection } from './SpecialFeaturesSection';

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
            <SpaceFormFields form={form} />
            <SpecialFeaturesSection form={form} />
            
            <DialogFooter>
              <Button type="submit">Adaugă spațiu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
