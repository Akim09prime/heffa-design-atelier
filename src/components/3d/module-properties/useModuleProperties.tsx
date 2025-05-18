
import { useState, useEffect } from 'react';
import { FurnitureModule, Material, AccessoryItem } from '@/types';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { ComboLogicService } from '@/services/comboLogicService';
import { PricingService } from '@/services/pricingService';
import { useToast } from '@/hooks/use-toast';

export const useModuleProperties = (
  initialModule: FurnitureModule,
  onUpdate: (module: FurnitureModule) => void
) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [editedModule, setEditedModule] = useState<FurnitureModule>({...initialModule});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [blockedOptions, setBlockedOptions] = useState<string[]>([]);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    materials: number;
    accessories: number;
    processing: number;
    labor: number;
  }>({ materials: 0, accessories: 0, processing: 0, labor: 0 });
  const { toast } = useToast();

  // Fetch materials and accessories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMaterials = await MaterialService.getAllMaterials();
        setMaterials(fetchedMaterials);
        
        const fetchedAccessories = await AccessoryService.getAllAccessories();
        setAccessories(fetchedAccessories);
      } catch (error) {
        console.error('Failed to fetch materials and accessories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load materials and accessories',
          variant: 'destructive'
        });
      }
    };
    
    fetchData();
  }, [toast]);

  // Update the module when the props change
  useEffect(() => {
    setEditedModule({...initialModule});
  }, [initialModule]);

  // Apply combo logic rules
  useEffect(() => {
    const applyRules = async () => {
      try {
        // Convert materials array to a Map for ComboLogicService
        const materialsMap = new Map<string, Material>();
        materials.forEach(material => {
          materialsMap.set(material.id, material);
        });
        
        const { updatedModule, messages, blockedOptions } = await ComboLogicService.applyRules(
          editedModule,
          materialsMap
        );
        
        setEditedModule(updatedModule);
        setWarnings(messages);
        setBlockedOptions(blockedOptions);
        
        // Display warnings as toasts
        messages.forEach(message => {
          toast({
            title: 'Rule Applied',
            description: message
          });
        });
      } catch (error) {
        console.error('Error applying combo rules:', error);
      }
    };
    
    if (materials.length > 0) {
      applyRules();
    }
  }, [materials, editedModule.type, editedModule.materials, toast]);

  // Calculate price whenever module changes
  useEffect(() => {
    if (materials.length > 0 && accessories.length > 0) {
      try {
        console.log('Calculating price for module:', editedModule);
        const { total, breakdown } = PricingService.calculateModulePrice(
          editedModule, 
          materials, 
          accessories
        );
        
        console.log('Price calculation result:', { total, breakdown });
        
        // Update module price
        setEditedModule(prev => ({
          ...prev,
          price: total
        }));
        
        // Update price breakdown
        setPriceBreakdown(breakdown);
      } catch (error) {
        console.error('Error calculating price:', error);
      }
    }
  }, [editedModule.materials, editedModule.accessories, editedModule.processingOptions, materials, accessories]);

  // Save changes handler
  const handleSave = () => {
    try {
      // Final price calculation
      const { total } = PricingService.calculateModulePrice(
        editedModule,
        materials,
        accessories
      );
      
      const updatedModule = {
        ...editedModule,
        price: total
      };
      
      onUpdate(updatedModule);
      
      toast({
        title: 'Module Updated',
        description: 'Your changes have been saved successfully.'
      });
    } catch (error) {
      console.error('Error saving module:', error);
      toast({
        title: 'Error',
        description: 'Failed to save module changes',
        variant: 'destructive'
      });
    }
  };

  // Module type change handler
  const handleTypeChange = (type: typeof initialModule.type) => {
    setEditedModule(prev => ({ ...prev, type }));
  };

  return {
    materials,
    accessories,
    editedModule,
    setEditedModule,
    warnings,
    blockedOptions,
    priceBreakdown,
    showPriceBreakdown,
    setShowPriceBreakdown,
    handleTypeChange,
    handleSave
  };
};
