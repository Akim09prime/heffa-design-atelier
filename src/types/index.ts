
export type UserRole = 'client' | 'designer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Material types
export type MaterialType = 'PAL' | 'MDF' | 'MDF-AGT' | 'PFL' | 'GLASS' | 'COUNTERTOP';

export interface Material {
  id: string;
  code: string;
  name: string;
  type: MaterialType;
  thickness: number; // in mm
  paintable: boolean;
  cantable: boolean;
  manufacturer: string;
  pricePerSqm: number;
  textureUrl?: string;
  imageUrl?: string;
  availability: boolean;
  compatibleOperations: ProcessingType[];
  supplier: 'Egger' | 'AGT' | 'SticlaExpert' | 'Hafele' | 'Blum' | 'GTV' | 'Other';
}

// Accessory types
export type AccessoryType = 
  'hinge' | 
  'slide' | 
  'handle' | 
  'foot' | 
  'profile' | 
  'push_system' | 
  'shelf_support' |
  'other';

export interface AccessoryItem {
  id: string;
  code: string;
  name: string;
  type: AccessoryType;
  manufacturer: string;
  price: number;
  imageUrl?: string;
  pdfUrl?: string;
  compatibility: ModuleType[];
  properties: Record<string, string | number | boolean>;
}

// Processing types
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

// Project types
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

export interface Accessory {
  id: string;
  type: AccessoryType;
  accessoryItemId: string;
  quantity: number;
}

export interface Processing {
  id: string;
  type: ProcessingType;
  materialId: string;
  area: number; // in square meters
}

export interface MaterialRule {
  materialType: MaterialType;
  allowedProcessing: ProcessingType[];
  allowedParts: ('body' | 'door' | 'drawer_front' | 'shelf' | 'back_panel' | 'countertop' | 'other')[];
}

export interface ComboRule {
  id: string;
  name: string;
  description: string;
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

// Export Types
export type ExportFormat = 'pdf' | 'excel' | 'dxf' | 'svg' | 'json';

export interface ExportConfig {
  format: ExportFormat;
  includeDetails: boolean;
  includeImages: boolean;
  includeAccessories: boolean;
  includeCutting: boolean;
}

// Client Types - added for client management functionality
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  projects: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
}

// AI Assistant
export interface AiAssistantMessage {
  id: string;
  text: string;
  timestamp: Date;
  type: 'suggestion' | 'warning' | 'error' | 'info';
  relatedTo?: {
    type: 'module' | 'material' | 'accessory' | 'processing';
    id: string;
  };
}
