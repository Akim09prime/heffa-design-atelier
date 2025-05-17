
import { Material, FurnitureModule, ModuleMaterial, Accessory, Processing } from '@/types';

// Define pricing constants
const CONSTANTS = {
  EDGE_BANDING_PRICE_PER_ML: 3.5,
  CNC_CLASSIC_PRICE_PER_SQM: 60,
  CNC_RIFLED_PRICE_PER_SQM: 68, 
  GLASS_SANDBLAST_PRICE_PER_SQM: 18,
  GLASS_DRILL_PRICE_PER_HOLE: 5,
};

export const PricingService = {
  // Calculate material price based on area and material type
  calculateMaterialPrice: (material: Material, areaInSqm: number): number => {
    return material.pricePerSqm * areaInSqm;
  },
  
  // Calculate edge banding price based on perimeter and material
  calculateEdgeBandingPrice: (perimeter: number, canApplyBanding: boolean): number => {
    if (!canApplyBanding) return 0;
    return perimeter * CONSTANTS.EDGE_BANDING_PRICE_PER_ML;
  },
  
  // Calculate processing price based on processing type and area
  calculateProcessingPrice: (processing: Processing): number => {
    switch (processing.type) {
      case 'cnc_classic':
        return CONSTANTS.CNC_CLASSIC_PRICE_PER_SQM * processing.area;
      case 'cnc_rifled':
        return CONSTANTS.CNC_RIFLED_PRICE_PER_SQM * processing.area;
      case 'glass_sandblast':
        return CONSTANTS.GLASS_SANDBLAST_PRICE_PER_SQM * processing.area;
      case 'glass_drill':
        // Assuming area in this case is number of holes
        return CONSTANTS.GLASS_DRILL_PRICE_PER_HOLE * processing.area;
      case 'edge_banding':
        // Edge banding is calculated separately
        return 0;
      default:
        return 0;
    }
  },
  
  // Calculate total module price
  calculateModulePrice: (
    module: FurnitureModule, 
    materials: Material[], 
    accessories: { [id: string]: { price: number, quantity: number } }
  ): number => {
    let totalPrice = 0;
    
    // Calculate material costs
    module.materials.forEach((moduleMaterial) => {
      const material = materials.find(m => m.id === moduleMaterial.materialId);
      if (material) {
        // Material cost
        totalPrice += material.pricePerSqm * moduleMaterial.quantity;
        
        // Edge banding cost if applicable
        if (material.cantable && (moduleMaterial.part === 'body' || moduleMaterial.part === 'door')) {
          // Simplified calculation - in reality would depend on the actual edge length
          const estimatedPerimeter = Math.sqrt(moduleMaterial.quantity) * 4;
          totalPrice += CONSTANTS.EDGE_BANDING_PRICE_PER_ML * estimatedPerimeter;
        }
      }
    });
    
    // Calculate processing costs
    module.processingOptions.forEach((processing) => {
      totalPrice += PricingService.calculateProcessingPrice(processing);
    });
    
    // Add accessories costs
    module.accessories.forEach((accessory) => {
      const accessoryItem = accessories[accessory.accessoryItemId];
      if (accessoryItem) {
        totalPrice += accessoryItem.price * accessory.quantity;
      }
    });
    
    return totalPrice;
  },
  
  // Calculate total project price
  calculateProjectPrice: (
    modules: FurnitureModule[], 
    materials: Material[],
    accessories: { [id: string]: { price: number, quantity: number } }
  ): number => {
    return modules.reduce((total, module) => {
      return total + PricingService.calculateModulePrice(module, materials, accessories);
    }, 0);
  }
};
