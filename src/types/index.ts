export type UserRole = 'client' | 'designer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  projectIds?: string[];
  active: boolean;
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

// Project types
export type ProjectType = 'Kitchen' | 'Living Room' | 'Bedroom' | 'Hallway' | 'Bathroom' | 'Balcony/Terrace' | 'Apartment' | 'House/Villa' | 'Free Mode';
export type ProjectSubType = 'Straight' | 'L-shape' | 'U-shape' | 'Island' | 'Sliding' | 'Classic' | 'Glass' | 'MDF' | '';
export type ProjectStatus = 'draft' | 'saved' | 'completed' | 'approved' | 'rejected' | 'archived' | 'imported';

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: ProjectType;
  subType?: ProjectSubType;
  parameters: Record<string, any>;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  roomType: RoomType;
  modules: FurnitureModule[];
  dimensions: RoomDimensions;
  priceBreakdown?: Record<string, any>;
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
  enabled?: boolean;
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

// App Mode for client interface
export type AppMode = 'configurator' | 'showroom';

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

// Report Types
export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'materials' | 'accessories' | 'processing' | 'custom';
  dateCreated: Date;
  dateRange: {
    start: Date;
    end: Date;
  };
  format: 'pdf' | 'excel' | 'json';
  generatedBy: string; // User ID
  url?: string;
  status: 'pending' | 'completed' | 'failed';
}

// Pricing Types
export interface PricingRule {
  id: string;
  name: string;
  type: 'material' | 'accessory' | 'processing' | 'labor' | 'discount';
  value: number;
  unit: 'percentage' | 'fixed';
  applicableItems: string[]; // IDs of items this rule applies to
  minimumQuantity?: number;
  minimumValue?: number;
  startDate?: Date;
  endDate?: Date;
  enabled: boolean;
}

// System Settings
export interface SystemSetting {
  id: string;
  category: 'general' | 'pricing' | 'materials' | 'processing' | 'export' | 'notification';
  key: string;
  value: string | number | boolean;
  description: string;
  updatedAt: Date;
  updatedBy: string; // User ID
}

// AI Logging
export interface AiLog {
  id: string;
  userId: string;
  role: UserRole;
  timestamp: Date;
  trigger: string;
  message: string;
  action: 'clicked' | 'ignored' | 'applied' | 'dismissed';
}
