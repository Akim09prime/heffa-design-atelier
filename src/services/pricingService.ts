
import { FurnitureModule, Material, AccessoryItem, ProcessingType } from '@/types';

export interface PriceBreakdown {
  materials: number;
  accessories: number;
  processing: number;
  labor: number;
}

export const PricingService = {
  // Calculate total module price with breakdown
  calculateModulePrice: (
    module: FurnitureModule,
    materials: Material[],
    accessories: AccessoryItem[]
  ): { total: number; breakdown: PriceBreakdown } => {
    // Calculate cost for each category
    const materialsCost = PricingService.calculateMaterialsCost(module, materials);
    const accessoriesCost = PricingService.calculateAccessoriesCost(module, accessories);
    const processingCost = PricingService.calculateProcessingCost(module);
    const laborCost = PricingService.calculateLaborCost(module);
    
    // Calculate total price
    const total = materialsCost + accessoriesCost + processingCost + laborCost;
    
    return {
      total,
      breakdown: {
        materials: materialsCost,
        accessories: accessoriesCost,
        processing: processingCost,
        labor: laborCost
      }
    };
  },
  
  // Calculate the total price for an entire project (across all modules)
  calculateProjectPrice: (
    modules: FurnitureModule[],
    materials: Material[],
    accessories: AccessoryItem[]
  ): number => {
    let totalPrice = 0;
    
    // Sum up the price of each module in the project
    modules.forEach(module => {
      const modulePrice = PricingService.calculateModulePrice(module, materials, accessories);
      totalPrice += modulePrice.total;
    });
    
    return totalPrice;
  },
  
  // Calculate materials cost
  calculateMaterialsCost: (module: FurnitureModule, materials: Material[]): number => {
    let cost = 0;
    
    // For each material used in the module
    module.materials.forEach(moduleMaterial => {
      // Find the material details
      const material = materials.find(m => m.id === moduleMaterial.materialId);
      
      if (material) {
        // Calculate cost based on quantity and price per square meter
        cost += moduleMaterial.quantity * material.pricePerSqm;
      }
    });
    
    return cost;
  },
  
  // Calculate accessories cost
  calculateAccessoriesCost: (module: FurnitureModule, accessories: AccessoryItem[]): number => {
    let cost = 0;
    
    // For each accessory used in the module
    module.accessories.forEach(moduleAccessory => {
      // Find the accessory details
      const accessory = accessories.find(a => a.id === moduleAccessory.accessoryItemId);
      
      if (accessory) {
        // Calculate cost based on quantity and price per unit
        cost += moduleAccessory.quantity * accessory.price;
      }
    });
    
    return cost;
  },
  
  // Calculate processing cost
  calculateProcessingCost: (module: FurnitureModule): number => {
    // Base processing costs per type (per square meter or linear meter)
    const processingCosts: Record<ProcessingType, number> = {
      'cnc_classic': 25,
      'cnc_rifled': 35,
      'glass_cut': 20,
      'glass_sandblast': 45,
      'glass_drill': 10,
      'glass_cnc': 50,
      'edge_banding': 8, // per linear meter
      'painting': 40,
      'other': 15
    };
    
    let cost = 0;
    
    // For each processing operation
    module.processingOptions.forEach(processing => {
      const processingCost = processingCosts[processing.type] || 15; // Default to 'other' cost
      cost += processing.area * processingCost;
    });
    
    // Add edge banding costs separately if available in processing data
    module.processingOptions
      .filter(p => p.type === 'edge_banding')
      .forEach(edgeBanding => {
        // Calculate edge length based on module dimensions for the material part
        const edgeLength = PricingService.calculateEdgeLength(module, edgeBanding.materialId);
        cost += edgeLength * processingCosts.edge_banding;
      });
    
    return cost;
  },
  
  // Calculate labor cost
  calculateLaborCost: (module: FurnitureModule): number => {
    // Base labor cost calculation
    // We'll use a simpler model based on size and complexity:
    // - Size factor: volume of module
    // - Complexity factor: number of different materials, accessories, and processing options
    
    // Calculate volume in cubic meters
    const volume = (module.width * module.height * module.depth) / 1000000000;
    
    // Count unique materials, accessories, and processing types
    const uniqueMaterials = new Set(module.materials.map(m => m.materialId)).size;
    const uniqueAccessories = new Set(module.accessories.map(a => a.accessoryItemId)).size;
    const uniqueProcessing = new Set(module.processingOptions.map(p => p.type)).size;
    
    // Complexity factor
    const complexity = 1 + (uniqueMaterials * 0.1) + (uniqueAccessories * 0.2) + (uniqueProcessing * 0.3);
    
    // Labor rate (per cubic meter, adjusted by complexity)
    const laborRate = 2000; // Lei per cubic meter of furniture
    
    return volume * complexity * laborRate;
  },
  
  // Helper method to calculate edge length for edge banding
  calculateEdgeLength: (module: FurnitureModule, materialId: string): number => {
    // Find the material that needs edge banding
    const material = module.materials.find(m => m.materialId === materialId);
    
    if (!material) {
      return 0;
    }
    
    // Simplified calculation based on part type
    switch (material.part) {
      case 'door':
      case 'drawer_front':
        // For doors and drawer fronts, typically all four edges are banded
        // Calculate perimeter based on module dimensions
        return 2 * (module.width + module.height) / 1000; // Convert to meters
        
      case 'shelf':
        // For shelves, typically only the front edge is banded
        return module.width / 1000; // Convert to meters
        
      case 'body':
        // For body parts, it depends on the design, using a simplification
        return (2 * module.width + 2 * module.depth) / 1000; // Convert to meters
        
      case 'countertop':
        // For countertops, typically only the front and side edges are banded
        return (module.width + 2 * module.depth) / 1000; // Convert to meters
        
      default:
        // Default case for other parts
        return module.width / 1000; // Convert to meters
    }
  }
};
