
// This file is deprecated and maintained for backwards compatibility.
// Please use pricingService.ts instead.
import { FurnitureModule, Material, AccessoryItem } from '@/types';
import { PricingService } from './pricingService';

// Re-export the pricing service from pricingService.ts
export const PriceCalculationService = {
  calculateModulePrice: (
    module: FurnitureModule,
    materials: Material[],
    accessories: AccessoryItem[]
  ) => {
    return PricingService.calculateModulePrice(module, materials, accessories);
  },
  
  calculateMaterialsCost: (module: FurnitureModule, materials: Material[]) => {
    return PricingService.calculateMaterialsCost(module, materials);
  },
  
  calculateAccessoriesCost: (module: FurnitureModule, accessories: AccessoryItem[]) => {
    return PricingService.calculateAccessoriesCost(module, accessories);
  },
  
  calculateProcessingCost: (module: FurnitureModule) => {
    return PricingService.calculateProcessingCost(module);
  },
  
  calculateLaborCost: (module: FurnitureModule) => {
    return PricingService.calculateLaborCost(module);
  },
  
  calculateEdgeLength: (module: FurnitureModule, partType: string) => {
    return PricingService.calculateEdgeLength(module, partType);
  }
};

