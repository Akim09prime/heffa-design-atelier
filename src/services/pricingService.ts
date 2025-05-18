
import { Material, FurnitureModule, ModuleMaterial, Accessory, Processing, AccessoryItem } from '@/types';

// Define pricing constants
export const PRICING_CONSTANTS = {
  EDGE_BANDING_PRICE_PER_ML: 3.5,
  CNC_CLASSIC_PRICE_PER_SQM: 60,
  CNC_RIFLED_PRICE_PER_SQM: 68, 
  GLASS_SANDBLAST_PRICE_PER_SQM: 18,
  GLASS_DRILL_PRICE_PER_HOLE: 5,
  PAINTING_PRICE_PER_SQM: 45,
  LABOR_RATE_PER_CUBIC_M: 100,
};

export const PricingService = {
  // Calculate material price based on area and material type
  calculateMaterialPrice: (material: Material, areaInSqm: number): number => {
    return material.pricePerSqm * areaInSqm;
  },
  
  // Calculate edge banding price based on perimeter and material
  calculateEdgeBandingPrice: (perimeter: number, canApplyBanding: boolean): number => {
    if (!canApplyBanding) return 0;
    return perimeter * PRICING_CONSTANTS.EDGE_BANDING_PRICE_PER_ML;
  },
  
  // Calculate processing price based on processing type and area
  calculateProcessingPrice: (processing: Processing): number => {
    switch (processing.type) {
      case 'cnc_classic':
        return PRICING_CONSTANTS.CNC_CLASSIC_PRICE_PER_SQM * processing.area;
      case 'cnc_rifled':
        return PRICING_CONSTANTS.CNC_RIFLED_PRICE_PER_SQM * processing.area;
      case 'glass_sandblast':
        return PRICING_CONSTANTS.GLASS_SANDBLAST_PRICE_PER_SQM * processing.area;
      case 'glass_drill':
        // Assuming area in this case is number of holes
        return PRICING_CONSTANTS.GLASS_DRILL_PRICE_PER_HOLE * processing.area;
      case 'painting':
        return PRICING_CONSTANTS.PAINTING_PRICE_PER_SQM * processing.area;
      case 'edge_banding':
        // Edge banding is calculated separately
        return 0;
      default:
        return 0;
    }
  },

  // Calculate edge length based on part type and module dimensions
  calculateEdgeLength: (module: FurnitureModule, partType: string): number => {
    const width = module.width / 1000; // Convert to meters
    const height = module.height / 1000;
    const depth = module.depth / 1000;
    
    switch(partType) {
      case 'body':
        // Side panels
        return (height * 2 + depth * 2) * 2;
      case 'door':
      case 'drawer_front':
        // Front perimeter
        return (width + height) * 2;
      case 'shelf':
        // Front edge only typically
        return width;
      default:
        return 0;
    }
  },

  // Calculate labor cost
  calculateLaborCost: (module: FurnitureModule): number => {
    // Simplified labor calculation based on module volume and complexity
    const volume = (module.width * module.height * module.depth) / 1000000000; // Convert to cubic meters
    const complexity = 1 + (module.accessories.length * 0.1) + (module.processingOptions.length * 0.2);
    
    return volume * PRICING_CONSTANTS.LABOR_RATE_PER_CUBIC_M * complexity;
  },
  
  // Calculate materials cost with detailed breakdown
  calculateMaterialsCost: (module: FurnitureModule, materials: Material[]): number => {
    return module.materials.reduce((total, moduleMaterial) => {
      const material = materials.find(m => m.id === moduleMaterial.materialId);
      
      if (material) {
        // Calculate based on quantity (already in square meters) and price per square meter
        const materialCost = material.pricePerSqm * moduleMaterial.quantity;
        
        // Add edge banding cost if applicable
        let edgeBandingCost = 0;
        if (material.cantable && ['body', 'door', 'drawer_front', 'shelf'].includes(moduleMaterial.part)) {
          // Calculate edge banding
          const edgeLength = PricingService.calculateEdgeLength(module, moduleMaterial.part);
          edgeBandingCost = edgeLength * PRICING_CONSTANTS.EDGE_BANDING_PRICE_PER_ML;
        }
        
        return total + materialCost + edgeBandingCost;
      }
      
      return total;
    }, 0);
  },

  // Calculate accessories cost
  calculateAccessoriesCost: (module: FurnitureModule, accessories: AccessoryItem[]): number => {
    return module.accessories.reduce((total, moduleAccessory) => {
      const accessory = accessories.find(a => a.id === moduleAccessory.accessoryItemId);
      
      if (accessory) {
        return total + (accessory.price * moduleAccessory.quantity);
      }
      
      return total;
    }, 0);
  },

  // Calculate processing cost
  calculateProcessingCost: (module: FurnitureModule): number => {
    return module.processingOptions.reduce((total, processing) => {
      return total + PricingService.calculateProcessingPrice(processing);
    }, 0);
  },
  
  // Calculate total module price with breakdown
  calculateModulePrice: (
    module: FurnitureModule, 
    materials: Material[],
    accessories: AccessoryItem[]
  ): { 
    total: number; 
    breakdown: { 
      materials: number; 
      accessories: number; 
      processing: number; 
      labor: number;
    }
  } => {
    // Calculate breakdown components
    const materialsPrice = PricingService.calculateMaterialsCost(module, materials);
    const accessoriesPrice = PricingService.calculateAccessoriesCost(module, accessories);
    const processingPrice = PricingService.calculateProcessingCost(module);
    const laborPrice = PricingService.calculateLaborCost(module);
    
    // Calculate total
    const total = materialsPrice + accessoriesPrice + processingPrice + laborPrice;
    
    return {
      total,
      breakdown: {
        materials: materialsPrice,
        accessories: accessoriesPrice,
        processing: processingPrice,
        labor: laborPrice
      }
    };
  },
  
  // Calculate total project price
  calculateProjectPrice: (
    modules: FurnitureModule[], 
    materials: Material[],
    accessories: AccessoryItem[]
  ): number => {
    return modules.reduce((total, module) => {
      return total + PricingService.calculateModulePrice(module, materials, accessories).total;
    }, 0);
  }
};
