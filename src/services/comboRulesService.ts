
import { FurnitureModule, ModuleType, Material, AccessoryItem, ComboRule } from '@/types';

// Define combo rules that automatically suggest accessories or materials based on module configuration
export const comboRules: ComboRule[] = [
  {
    id: '1',
    name: 'Drawer Slides',
    description: 'Automatically add slides to drawer units',
    if: {
      moduleType: 'drawer_unit'
    },
    then: {
      suggest: {
        accessory: {
          type: 'slide',
          manufacturer: 'Blum'
        }
      }
    }
  },
  {
    id: '2',
    name: 'Push System for Handleless',
    description: 'Add push system when no handles are selected',
    if: {
      // Custom logic will check for absence of handles
    },
    then: {
      suggest: {
        accessory: {
          type: 'push_system'
        }
      }
    }
  },
  {
    id: '3',
    name: 'Base Cabinet Feet',
    description: 'Add adjustable feet to base cabinets',
    if: {
      moduleType: 'base_cabinet'
    },
    then: {
      suggest: {
        accessory: {
          type: 'foot'
        }
      }
    }
  },
  {
    id: '4',
    name: 'Glass Door Profile',
    description: 'Add aluminum profile for glass doors',
    if: {
      // Custom logic checks material type
    },
    then: {
      suggest: {
        accessory: {
          type: 'profile'
        }
      }
    }
  },
  {
    id: '5',
    name: 'MDF Painting Restriction',
    description: 'Block painting for non-MDF materials',
    if: {
      // Custom logic will check material type
    },
    then: {
      warning: 'Painting can only be applied to MDF materials'
    }
  },
  {
    id: '6',
    name: 'Hinges for Cabinets with Doors',
    description: 'Add hinges based on door dimensions',
    if: {
      // Custom logic checks for doors
    },
    then: {
      suggest: {
        accessory: {
          type: 'hinge'
        }
      }
    }
  },
  {
    id: '7',
    name: 'Shelf Supports',
    description: 'Add shelf supports for any shelves',
    if: {
      // Custom logic checks for shelves
    },
    then: {
      suggest: {
        accessory: {
          type: 'shelf_support'
        }
      }
    }
  }
];

export const ComboRulesService = {
  // Generate suggestions for a module based on combo rules
  generateSuggestions: (
    module: FurnitureModule, 
    allMaterials: Material[], 
    allAccessories: AccessoryItem[]
  ) => {
    const suggestions: {
      type: 'accessory' | 'material' | 'processing';
      id: string;
      name: string;
      reason: string;
    }[] = [];
    
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Helper function to find module materials by part
    const findMaterialsByPart = (part: string) => {
      return module.materials.filter(m => m.part === part);
    };
    
    // Helper function to check if module has accessory type
    const hasAccessoryType = (type: string) => {
      return module.accessories.some(acc => {
        const accessory = allAccessories.find(a => a.id === acc.accessoryItemId);
        return accessory && accessory.type === type;
      });
    };
    
    // Apply each rule
    comboRules.forEach(rule => {
      let conditionsMet = true;
      
      // Check module type condition
      if (rule.if.moduleType && module.type !== rule.if.moduleType) {
        conditionsMet = false;
      }
      
      // Check dimension conditions if specified
      if (rule.if.dimension && conditionsMet) {
        const { property, value, operator } = rule.if.dimension;
        
        if (property === 'width') {
          switch (operator) {
            case '=':
              conditionsMet = module.width === value;
              break;
            case '>':
              conditionsMet = module.width > value;
              break;
            case '<':
              conditionsMet = module.width < value;
              break;
            case '>=':
              conditionsMet = module.width >= value;
              break;
            case '<=':
              conditionsMet = module.width <= value;
              break;
          }
        } else if (property === 'height') {
          switch (operator) {
            case '=':
              conditionsMet = module.height === value;
              break;
            case '>':
              conditionsMet = module.height > value;
              break;
            case '<':
              conditionsMet = module.height < value;
              break;
            case '>=':
              conditionsMet = module.height >= value;
              break;
            case '<=':
              conditionsMet = module.height <= value;
              break;
          }
        } else if (property === 'depth') {
          switch (operator) {
            case '=':
              conditionsMet = module.depth === value;
              break;
            case '>':
              conditionsMet = module.depth > value;
              break;
            case '<':
              conditionsMet = module.depth < value;
              break;
            case '>=':
              conditionsMet = module.depth >= value;
              break;
            case '<=':
              conditionsMet = module.depth <= value;
              break;
          }
        }
      }
      
      // Custom logic based on rule ID
      if (conditionsMet) {
        switch (rule.id) {
          case '2': // Push System for Handleless
            conditionsMet = !hasAccessoryType('handle');
            break;
            
          case '4': // Glass Door Profile
            const doorMaterials = findMaterialsByPart('door');
            conditionsMet = doorMaterials.some(mat => {
              const material = allMaterials.find(m => m.id === mat.materialId);
              return material && material.type === 'GLASS';
            });
            break;
            
          case '5': // MDF Painting Restriction
            const hasPainting = module.processingOptions.some(p => p.type === 'painting');
            if (hasPainting) {
              const paintedMaterials = module.processingOptions
                .filter(p => p.type === 'painting')
                .map(p => p.materialId);
                
              const nonMdfPainted = paintedMaterials.some(matId => {
                const material = allMaterials.find(m => m.id === matId);
                return material && material.type !== 'MDF';
              });
              
              conditionsMet = nonMdfPainted;
            } else {
              conditionsMet = false;
            }
            break;
            
          case '6': // Hinges for Cabinets with Doors
            conditionsMet = findMaterialsByPart('door').length > 0 && 
                           !hasAccessoryType('hinge');
            break;
            
          case '7': // Shelf Supports
            conditionsMet = findMaterialsByPart('shelf').length > 0 && 
                           !hasAccessoryType('shelf_support');
            break;
        }
      }
      
      // Apply rule consequences if conditions are met
      if (conditionsMet) {
        if (rule.then.warning) {
          warnings.push(rule.then.warning);
        }
        
        if (rule.then.error) {
          errors.push(rule.then.error);
        }
        
        if (rule.then.suggest) {
          const { accessory, material, processing } = rule.then.suggest;
          
          if (accessory) {
            // Find matching accessories
            const matchingAccessories = allAccessories.filter(acc => {
              if (acc.type !== accessory.type) return false;
              if (accessory.manufacturer && acc.manufacturer !== accessory.manufacturer) return false;
              if (accessory.code && acc.code !== accessory.code) return false;
              return true;
            });
            
            if (matchingAccessories.length > 0) {
              // Suggest the first matching accessory
              const suggested = matchingAccessories[0];
              suggestions.push({
                type: 'accessory',
                id: suggested.id,
                name: suggested.name,
                reason: rule.description
              });
            }
          }
          
          if (material) {
            // Find matching materials
            const matchingMaterials = allMaterials.filter(mat => {
              if (mat.type !== material.type) return false;
              if (material.manufacturer && mat.manufacturer !== material.manufacturer) return false;
              if (material.code && mat.code !== material.code) return false;
              return true;
            });
            
            if (matchingMaterials.length > 0) {
              // Suggest the first matching material
              const suggested = matchingMaterials[0];
              suggestions.push({
                type: 'material',
                id: suggested.id,
                name: suggested.name,
                reason: rule.description
              });
            }
          }
          
          if (processing) {
            suggestions.push({
              type: 'processing',
              id: processing.type,
              name: processing.type.replace('_', ' '),
              reason: rule.description
            });
          }
        }
      }
    });
    
    return {
      suggestions,
      warnings,
      errors
    };
  }
};
