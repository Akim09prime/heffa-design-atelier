
export type UserRole = 'client' | 'designer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  roomType: RoomType;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  modules: FurnitureModule[];
  dimensions: RoomDimensions;
}

export type RoomType = 'kitchen' | 'bathroom' | 'bedroom' | 'livingroom' | 'office' | 'other';

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
  walls: Wall[];
}

export interface Wall {
  id: string;
  position: [number, number, number]; // x, y, z
  rotation: [number, number, number]; // x, y, z
  width: number;
  height: number;
  hasWindow?: boolean;
  hasDoor?: boolean;
}

export interface FurnitureModule {
  id: string;
  name: string;
  description: string;
  type: ModuleType;
  width: number;
  height: number;
  depth: number;
  position: [number, number, number]; // x, y, z
  rotation: [number, number, number]; // x, y, z
  materials: ModuleMaterial[];
  accessories: Accessory[];
  processingOptions: Processing[];
  price: number;
  modelUrl?: string;
  thumbnailUrl?: string;
}

export type ModuleType = 
  'base_cabinet' | 
  'wall_cabinet' | 
  'tall_cabinet' | 
  'drawer_unit' | 
  'corner_cabinet' | 
  'shelf_unit' | 
  'island' |
  'other';

export interface ModuleMaterial {
  id: string;
  type: MaterialType;
  materialId: string;
  part: 'body' | 'door' | 'drawer_front' | 'shelf' | 'back_panel' | 'countertop' | 'other';
  quantity: number; // in square meters
}

export type MaterialType = 'PAL' | 'MDF' | 'MDF-AGT' | 'PFL' | 'GLASS' | 'COUNTERTOP';

export interface Material {
  id: string;
  code: string;
  name: string;
  type: MaterialType;
  manufacturer: string;
  thickness: number; // in mm
  pricePerSqm: number;
  textureUrl?: string;
  imageUrl?: string;
  availability: boolean;
}

export interface Accessory {
  id: string;
  type: AccessoryType;
  materialId: string;
  quantity: number;
}

export type AccessoryType = 
  'hinge' | 
  'slide' | 
  'handle' | 
  'foot' | 
  'profile' | 
  'push_system' | 
  'other';

export interface AccessoryItem {
  id: string;
  code: string;
  name: string;
  type: AccessoryType;
  manufacturer: string;
  price: number;
  imageUrl?: string;
  compatibility: ModuleType[];
}

export interface Processing {
  id: string;
  type: ProcessingType;
  materialId: string;
  area: number; // in square meters
}

export type ProcessingType = 
  'cnc_classic' | 
  'cnc_rifled' | 
  'glass_cut' | 
  'glass_sandblast' | 
  'glass_drill' | 
  'glass_cnc' |
  'edge_banding' |
  'painting' |
  'other';

export interface ProcessingOption {
  id: string;
  name: string;
  type: ProcessingType;
  pricePerUnit: number;
  compatibleMaterials: MaterialType[];
}

export interface MaterialRule {
  materialType: MaterialType;
  allowedProcessing: ProcessingType[];
  allowedParts: ('body' | 'door' | 'drawer_front' | 'shelf' | 'back_panel' | 'countertop' | 'other')[];
}

export interface ComboRule {
  if: {
    moduleType?: ModuleType;
    dimension?: {
      property: 'width' | 'height' | 'depth';
      value: number;
      operator: '=' | '>' | '<' | '>=' | '<=';
    };
    materialType?: MaterialType;
    accessoryType?: AccessoryType;
    processingType?: ProcessingType;
  };
  then: {
    suggest: {
      accessory?: {
        type: AccessoryType;
        manufacturer?: string;
        code?: string;
      };
      material?: {
        type: MaterialType;
        manufacturer?: string;
        code?: string;
      };
      processing?: {
        type: ProcessingType;
      };
    };
    warning?: string;
    error?: string;
  };
}
