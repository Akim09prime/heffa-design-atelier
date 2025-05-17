import { AccessoryItem, FurnitureModule, Material, ModuleType } from '@/types';
import { AccessoryService } from './accessoryService';

// Interface for combo rule
interface ComboRule {
  id: string;
  condition: {
    moduleType?: ModuleType;
    materialType?: string;
    hasDoor?: boolean;
    hasDrawer?: boolean;
    height?: {
      min?: number;
      max?: number;
    };
    width?: {
      min?: number;
      max?: number;
    };
    depth?: {
      min?: number;
      max?: number;
    };
    hasHandle?: boolean;
    frontMaterial?: string;
  };
  action: {
    type: 'add_accessory' | 'block_option' | 'suggest' | 'warn';
    message?: string;
    accessoryType?: string;
    accessoryCode?: string;
    option?: string;
  };
  priority: number;
  enabled: boolean;
}

// Sample rules based on PAS 4 and PAS 7
const comboRules: ComboRule[] = [
  {
    id: 'rule-1',
    condition: {
      hasDrawer: true,
      hasHandle: false
    },
    action: {
      type: 'add_accessory',
      message: 'A push system has been added to your drawer.',
      accessoryType: 'push_system'
    },
    priority: 1,
    enabled: true
  },
  {
    id: 'rule-2',
    condition: {
      hasDoor: true
    },
    action: {
      type: 'add_accessory',
      message: 'Hinges have been automatically added to your door.',
      accessoryType: 'hinge'
    },
    priority: 1,
    enabled: true
  },
  {
    id: 'rule-3',
    condition: {
      height: { min: 700 }
    },
    action: {
      type: 'add_accessory',
      message: 'Adjustable feet have been added to your tall cabinet.',
      accessoryType: 'foot'
    },
    priority: 2,
    enabled: true
  },
  {
    id: 'rule-4',
    condition: {
      frontMaterial: 'STICLA'
    },
    action: {
      type: 'add_accessory',
      message: 'Aluminum profile has been added for your glass door.',
      accessoryType: 'profile'
    },
    priority: 3,
    enabled: true
  },
  {
    id: 'rule-5',
    condition: {
      materialType: 'PAL'
    },
    action: {
      type: 'block_option',
      message: 'PAL cannot be painted.',
      option: 'paint'
    },
    priority: 1,
    enabled: true
  }
];

// ComboLogicService
export const ComboLogicService = {
  // Check if a rule applies to a module
  checkRule: (rule: ComboRule, module: FurnitureModule, materials: Map<string, Material>): boolean => {
    const { condition } = rule;
    
    // Check all conditions
    if (condition.moduleType && condition.moduleType !== module.type) return false;
    
    if (condition.hasDoor !== undefined) {
      const hasDoor = module.accessories.some(acc => acc.type === 'hinge');
      if (hasDoor !== condition.hasDoor) return false;
    }
    
    if (condition.hasDrawer !== undefined) {
      const hasDrawer = module.accessories.some(acc => acc.type === 'slide');
      if (hasDrawer !== condition.hasDrawer) return false;
    }
    
    if (condition.height) {
      if (condition.height.min && module.height < condition.height.min) return false;
      if (condition.height.max && module.height > condition.height.max) return false;
    }
    
    if (condition.width) {
      if (condition.width.min && module.width < condition.width.min) return false;
      if (condition.width.max && module.width > condition.width.max) return false;
    }
    
    if (condition.depth) {
      if (condition.depth.min && module.depth < condition.depth.min) return false;
      if (condition.depth.max && module.depth > condition.depth.max) return false;
    }
    
    if (condition.hasHandle !== undefined) {
      const hasHandle = module.accessories.some(acc => acc.type === 'handle');
      if (hasHandle !== condition.hasHandle) return false;
    }
    
    if (condition.materialType) {
      // Check if any of the module materials match the type
      const hasMaterialType = module.materials.some(mat => {
        const material = materials.get(mat.materialId);
        return material && material.type === condition.materialType;
      });
      if (!hasMaterialType) return false;
    }
    
    if (condition.frontMaterial) {
      // Check front material
      const frontMaterial = module.materials.find(mat => mat.part === 'door' || mat.part === 'drawer_front');
      if (!frontMaterial) return false;
      
      const material = materials.get(frontMaterial.materialId);
      if (!material || material.type !== condition.frontMaterial) return false;
    }
    
    return true;
  },
  
  // Apply rules to a module
  applyRules: async (module: FurnitureModule, materials: Map<string, Material>, enabledOnly: boolean = true): Promise<{
    updatedModule: FurnitureModule;
    messages: string[];
    blockedOptions: string[];
  }> => {
    const messages: string[] = [];
    const blockedOptions: string[] = [];
    let updatedModule = { ...module };
    
    // Filter and sort rules by priority
    const rules = enabledOnly 
      ? comboRules.filter(rule => rule.enabled)
      : comboRules;
    
    rules.sort((a, b) => a.priority - b.priority);
    
    // Apply each rule
    for (const rule of rules) {
      if (ComboLogicService.checkRule(rule, updatedModule, materials)) {
        const { action } = rule;
        
        if (action.message && !messages.includes(action.message)) {
          messages.push(action.message);
        }
        
        switch (action.type) {
          case 'add_accessory':
            if (action.accessoryType) {
              // Get appropriate accessory based on module
              const accessories = await AccessoryService.getAccessoriesByType(action.accessoryType as any);
              const compatibleAccessories = accessories.filter(acc => 
                acc.compatibility.includes(module.type)
              );
              
              if (compatibleAccessories.length > 0) {
                // Select first compatible accessory (in real app, we'd have more logic)
                const accessory = compatibleAccessories[0];
                
                // Check if module already has this type of accessory
                const hasAccessoryType = updatedModule.accessories.some(
                  acc => acc.type === action.accessoryType
                );
                
                if (!hasAccessoryType) {
                  updatedModule = {
                    ...updatedModule,
                    accessories: [
                      ...updatedModule.accessories,
                      {
                        id: `auto-${Math.random().toString(36).substring(2, 9)}`,
                        type: action.accessoryType as any,
                        accessoryItemId: accessory.id,
                        quantity: 1
                      }
                    ]
                  };
                }
              }
            }
            break;
            
          case 'block_option':
            if (action.option && !blockedOptions.includes(action.option)) {
              blockedOptions.push(action.option);
            }
            break;
            
          // Other action types can be implemented as needed
        }
      }
    }
    
    return {
      updatedModule,
      messages,
      blockedOptions
    };
  },
  
  // Get all rules
  getRules: (): ComboRule[] => {
    return [...comboRules];
  },
  
  // Add a rule
  addRule: (rule: Omit<ComboRule, 'id'>): ComboRule => {
    const newRule = {
      ...rule,
      id: `rule-${comboRules.length + 1}`
    };
    
    comboRules.push(newRule);
    return newRule;
  },
  
  // Update a rule
  updateRule: (id: string, updates: Partial<ComboRule>): ComboRule | null => {
    const index = comboRules.findIndex(rule => rule.id === id);
    
    if (index === -1) {
      return null;
    }
    
    comboRules[index] = {
      ...comboRules[index],
      ...updates
    };
    
    return comboRules[index];
  },
  
  // Delete a rule
  deleteRule: (id: string): boolean => {
    const initialLength = comboRules.length;
    const index = comboRules.findIndex(rule => rule.id === id);
    
    if (index === -1) {
      return false;
    }
    
    comboRules.splice(index, 1);
    return comboRules.length < initialLength;
  },
  
  // Toggle a rule
  toggleRule: (id: string): boolean => {
    const rule = comboRules.find(rule => rule.id === id);
    
    if (!rule) {
      return false;
    }
    
    rule.enabled = !rule.enabled;
    return true;
  }
};
