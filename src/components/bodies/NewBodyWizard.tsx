
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FurnitureBody } from '@/types';
import { BodyDimensionsStep } from './wizard/BodyDimensionsStep';
import { BodyPartsStep } from './wizard/BodyPartsStep';
import { BodyAccessoriesStep } from './wizard/BodyAccessoriesStep';
import { BodySummaryStep } from './wizard/BodySummaryStep';
import { useToast } from '@/hooks/use-toast';
import { BodyService } from '@/services/bodyService';

type NewBodyWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  onBodyCreated: (body: FurnitureBody) => void;
};

type WizardStep = 'dimensions' | 'parts' | 'accessories' | 'summary';

export const NewBodyWizard: React.FC<NewBodyWizardProps> = ({
  open,
  onOpenChange,
  spaceId,
  onBodyCreated
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('dimensions');
  const [isLoading, setIsLoading] = useState(false);
  const [bodyData, setBodyData] = useState({
    name: 'Corp nou',
    width: 600,
    height: 720,
    depth: 560,
    materialId: 'mat-1',
    includeShelf: false,
    includeDrawer: false,
    customParts: [] as any[],
    customAccessories: [] as any[]
  });
  
  const { toast } = useToast();
  
  const handleNextStep = () => {
    const steps: WizardStep[] = ['dimensions', 'parts', 'accessories', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };
  
  const handlePreviousStep = () => {
    const steps: WizardStep[] = ['dimensions', 'parts', 'accessories', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };
  
  const handleDimensionsChange = (dimensions: { name: string; width: number; height: number; depth: number }) => {
    setBodyData(prev => ({ ...prev, ...dimensions }));
  };
  
  const handlePartsChange = (parts: any) => {
    setBodyData(prev => ({ ...prev, ...parts }));
  };
  
  const handleAccessoriesChange = (accessories: any) => {
    setBodyData(prev => ({ ...prev, ...accessories }));
  };
  
  const handleCreateBody = async () => {
    setIsLoading(true);
    
    try {
      // Generate a new body using the service
      const newBody = await BodyService.generateFromTemplate(
        spaceId,
        bodyData.name,
        bodyData.width,
        bodyData.height,
        bodyData.depth,
        bodyData.materialId
      );
      
      // Add custom parts if any
      if (bodyData.customParts.length > 0) {
        for (const part of bodyData.customParts) {
          await BodyService.addPartToBody(newBody.id, part);
        }
      }
      
      // Add custom accessories if any
      if (bodyData.customAccessories.length > 0) {
        for (const accessory of bodyData.customAccessories) {
          await BodyService.addAccessoryToBody(newBody.id, accessory);
        }
      }
      
      // Refresh the body with all updates
      const finalBody = await BodyService.getBodyById(newBody.id);
      
      if (finalBody) {
        toast({
          title: "Corp creat cu succes",
          description: `Corpul "${finalBody.name}" a fost creat și adăugat la spațiul curent.`,
          variant: "success"
        });
        
        onBodyCreated(finalBody);
        resetAndClose();
      }
    } catch (error) {
      console.error('Error creating body:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la crearea corpului. Vă rugăm să încercați din nou.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetAndClose = () => {
    setCurrentStep('dimensions');
    setBodyData({
      name: 'Corp nou',
      width: 600,
      height: 720,
      depth: 560,
      materialId: 'mat-1',
      includeShelf: false,
      includeDrawer: false,
      customParts: [],
      customAccessories: []
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="designer-gradient-text">Wizard creare corp nou</DialogTitle>
          <DialogDescription>
            Completează detaliile pentru a crea un corp de mobilier nou. Poți folosi preseturile sau poți personaliza complet.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={currentStep} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger
              value="dimensions"
              onClick={() => setCurrentStep('dimensions')}
              className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
            >
              1. Dimensiuni
            </TabsTrigger>
            <TabsTrigger 
              value="parts"
              onClick={() => setCurrentStep('parts')}
              className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
            >
              2. Componente
            </TabsTrigger>
            <TabsTrigger
              value="accessories"
              onClick={() => setCurrentStep('accessories')}
              className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
            >
              3. Accesorii
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              onClick={() => setCurrentStep('summary')}
              className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
            >
              4. Sumar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dimensions">
            <BodyDimensionsStep 
              initialData={{
                name: bodyData.name,
                width: bodyData.width,
                height: bodyData.height,
                depth: bodyData.depth
              }}
              onDataChange={handleDimensionsChange} 
            />
          </TabsContent>
          
          <TabsContent value="parts">
            <BodyPartsStep 
              bodyDimensions={{
                width: bodyData.width,
                height: bodyData.height,
                depth: bodyData.depth
              }}
              onDataChange={handlePartsChange} 
            />
          </TabsContent>
          
          <TabsContent value="accessories">
            <BodyAccessoriesStep 
              bodyDimensions={{
                width: bodyData.width,
                height: bodyData.height,
                depth: bodyData.depth
              }}
              onDataChange={handleAccessoriesChange}
            />
          </TabsContent>
          
          <TabsContent value="summary">
            <BodySummaryStep bodyData={bodyData} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between gap-2 mt-4">
          {currentStep !== 'dimensions' && (
            <Button variant="outline" onClick={handlePreviousStep}>
              Înapoi
            </Button>
          )}
          
          <div className="flex-1"></div>
          
          {currentStep !== 'summary' ? (
            <Button onClick={handleNextStep}>
              Continuă
            </Button>
          ) : (
            <Button onClick={handleCreateBody} disabled={isLoading}>
              {isLoading ? 'Se creează...' : 'Finalizează'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
