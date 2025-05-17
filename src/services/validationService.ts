
import { Material, FurnitureModule, ModuleMaterial, Accessory, Processing, MaterialType, AccessoryType } from '@/types';

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export const ValidationService = {
  // Validate if a material can be painted
  validatePaintable: (material: Material, hasPaintProcessing: boolean): string[] => {
    const errors: string[] = [];
    
    if (hasPaintProcessing && !material.paintable) {
      errors.push(`${material.name} (${material.type}) cannot be painted. Only MDF standard can be painted.`);
    }
    
    return errors;
  },
  
  // Validate if a material can have edge banding
  validateCantable: (material: Material, hasEdgeBanding: boolean): string[] => {
    const errors: string[] = [];
    
    if (hasEdgeBanding && !material.cantable) {
      errors.push(`${material.name} (${material.type}) cannot have edge banding applied. Only PAL and MDF-AGT can have edge banding.`);
    }
    
    return errors;
  },
  
  // Validate if a processing option is compatible with a material
  validateCompatibleProcessing: (material: Material, processingType: string): string[] => {
    const errors: string[] = [];
    
    if (!material.compatibleOperations.includes(processingType as any)) {
      errors.push(`${processingType} processing is not compatible with ${material.name} (${material.type}).`);
    }
    
    return errors;
  },
  
  // Check if required accessories for a module type are present
  validateRequiredAccessories: (moduleType: string, accessories: Accessory[]): string[] => {
    const warnings: string[] = [];
    
    // Check for base cabinet requirements
    if (moduleType === 'base_cabinet') {
      // Check for feet
      if (!accessories.some(acc => acc.type === 'foot')) {
        warnings.push('Base cabinets typically require feet. Consider adding them.');
      }
    }
    
    // Check for drawer units
    if (moduleType === 'drawer_unit') {
      // Check for slides
      if (!accessories.some(acc => acc.type === 'slide')) {
        warnings.push('Drawer units require slides. Add appropriate slides for each drawer.');
      }
    }
    
    // Check for door units
    if (['base_cabinet', 'wall_cabinet', 'tall_cabinet'].includes(moduleType)) {
      // Check for hinges
      if (!accessories.some(acc => acc.type === 'hinge')) {
        warnings.push('Cabinet with doors require hinges. Consider adding them.');
      }
      
      // Check for handles
      if (!accessories.some(acc => acc.type === 'handle')) {
        // No handles might be intentional for push systems
        if (!accessories.some(acc => acc.type === 'push_system')) {
          warnings.push('No handles found. Consider adding handles or a push system.');
        }
      }
    }
    
    return warnings;
  },
  
  // Suggest accessories based on module configuration
  suggestAccessories: (module: FurnitureModule, materials: { [id: string]: Material }): string[] => {
    const suggestions: string[] = [];
    
    // Check if glass front without profiles
    const hasGlassFront = module.materials.some(mat => {
      const material = materials[mat.materialId];
      return mat.part === 'door' && material?.type === 'GLASS';
    });
    
    if (hasGlassFront && !module.accessories.some(acc => acc.type === 'profile')) {
      suggestions.push('Glass doors require aluminum profiles. Consider adding them.');
    }
    
    // Drawer unit suggestions
    if (module.type === 'drawer_unit') {
      // Suggest soft close for drawers
      if (!module.accessories.some(acc => acc.type === 'slide' && acc.accessoryItemId.includes('soft'))) {
        suggestions.push('Consider upgrading to soft-close drawer slides for better user experience.');
      }
    }
    
    // Shelf support suggestions
    const hasShelf = module.materials.some(mat => mat.part === 'shelf');
    if (hasShelf && !module.accessories.some(acc => acc.type === 'shelf_support')) {
      suggestions.push('Shelves require shelf supports. Add appropriate shelf supports based on shelf thickness.');
    }
    
    return suggestions;
  },
  
  // Comprehensive module validation
  validateModule: (
    module: FurnitureModule, 
    materials: { [id: string]: Material },
    accessories: { [id: string]: { type: AccessoryType } }
  ): ValidationResult => {
    const result: ValidationResult = {
      isValid: true,
      warnings: [],
      errors: [],
      suggestions: []
    };
    
    // Check materials and processing compatibility
    module.materials.forEach(mat => {
      const material = materials[mat.materialId];
      
      if (!material) {
        result.errors.push(`Material with ID ${mat.materialId} not found.`);
        result.isValid = false;
        return;
      }
      
      // Check for painting operations on this material
      const hasPaintingProcess = module.processingOptions.some(
        proc => proc.materialId === mat.materialId && proc.type === 'painting'
      );
      
      const paintErrors = ValidationService.validatePaintable(material, hasPaintingProcess);
      result.errors.push(...paintErrors);
      
      // Check for edge banding operations on this material
      const hasEdgeBanding = module.processingOptions.some(
        proc => proc.materialId === mat.materialId && proc.type === 'edge_banding'
      );
      
      const cantErrors = ValidationService.validateCantable(material, hasEdgeBanding);
      result.errors.push(...cantErrors);
      
      // Check all processing operations for this material
      module.processingOptions
        .filter(proc => proc.materialId === mat.materialId)
        .forEach(proc => {
          const procErrors = ValidationService.validateCompatibleProcessing(material, proc.type);
          result.errors.push(...procErrors);
        });
    });
    
    // Check required accessories
    const accessoryWarnings = ValidationService.validateRequiredAccessories(
      module.type, 
      module.accessories.map(acc => ({
        ...acc,
        type: accessories[acc.accessoryItemId]?.type || 'other'
      }))
    );
    result.warnings.push(...accessoryWarnings);
    
    // Generate suggestions
    const accessorySuggestions = ValidationService.suggestAccessories(module, materials);
    result.suggestions.push(...accessorySuggestions);
    
    // Update isValid flag based on errors
    if (result.errors.length > 0) {
      result.isValid = false;
    }
    
    return result;
  }
};
