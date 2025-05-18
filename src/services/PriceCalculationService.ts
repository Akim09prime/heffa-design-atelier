
import { FurnitureModule, Material, AccessoryItem, ModuleMaterial, Processing } from '@/types';

export const PriceCalculationService = {
  // Calculate module price with detailed breakdown
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
    // Initialize price breakdown
    const breakdown = {
      materials: 0,
      accessories: 0,
      processing: 0,
      labor: 0
    };
    
    // Calculate materials cost
    breakdown.materials = PriceCalculationService.calculateMaterialsCost(module, materials);
    
    // Calculate accessories cost
    breakdown.accessories = PriceCalculationService.calculateAccessoriesCost(module, accessories);
    
    // Calculate processing cost
    breakdown.processing = PriceCalculationService.calculateProcessingCost(module);
    
    // Calculate labor cost (simplified - in real app would be more complex)
    breakdown.labor = PriceCalculationService.calculateLaborCost(module);
    
    // Calculate total
    const total = breakdown.materials + breakdown.accessories + breakdown.processing + breakdown.labor;
    
    return {
      total,
      breakdown
    };
  },
  
  // Calculate materials cost
  calculateMaterialsCost: (module: FurnitureModule, materials: Material[]): number => {
    return module.materials.reduce((total, moduleMaterial) => {
      const material = materials.find(m => m.id === moduleMaterial.materialId);
      
      if (material) {
        // Calculate based on quantity (already in square meters) and price per square meter
        const materialCost = material.pricePerSqm * moduleMaterial.quantity;
        
        // Add edge banding cost if applicable
        let edgeBandingCost = 0;
        if (material.cantable && ['body', 'door', 'drawer_front', 'shelf'].includes(moduleMaterial.part)) {
          // Simplified edge banding calculation
          const edgeLength = PriceCalculationService.calculateEdgeLength(module, moduleMaterial.part);
          edgeBandingCost = edgeLength * 3.5; // 3.5 is price per meter of edge banding
        }
        
        return total + materialCost + edgeBandingCost;
      }
      
      return total;
    }, 0);
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
      switch (processing.type) {
        case 'cnc_classic':
          return total + (60 * processing.area); // 60 per sqm
        case 'cnc_rifled':
          return total + (68 * processing.area); // 68 per sqm
        case 'glass_sandblast':
          return total + (18 * processing.area); // 18 per sqm
        case 'glass_drill':
          return total + (5 * processing.area); // 5 per hole (area = number of holes)
        case 'painting':
          return total + (45 * processing.area); // 45 per sqm
        case 'edge_banding':
          // Edge banding is calculated separately with materials
          return total;
        default:
          return total;
      }
    }, 0);
  },
  
  // Calculate labor cost
  calculateLaborCost: (module: FurnitureModule): number => {
    // Simplified labor calculation based on module volume and complexity
    const volume = (module.width * module.height * module.depth) / 1000000000; // Convert to cubic meters
    const complexity = 1 + (module.accessories.length * 0.1) + (module.processingOptions.length * 0.2);
    
    return volume * 100 * complexity; // Base labor rate of 100 per cubic meter
  }
};
