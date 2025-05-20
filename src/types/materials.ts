
// Define material types
export type MaterialType = 
  | 'pal' 
  | 'mdf' 
  | 'mdf_agt' 
  | 'pfl' 
  | 'glass' 
  | 'countertop'
  | 'other';

// Define processing types
export type ProcessingType =
  | 'cutting'
  | 'edge_banding'
  | 'cnc'
  | 'painting'
  | 'glass_processing'
  | 'assembly'
  | 'other';

// Define material model
export interface Material {
  id: string;
  code: string;
  name: string;
  type: MaterialType;
  thickness: number;
  manufacturer: string;
  supplier: string;
  pricePerSqm: number;
  paintable: boolean;
  cantable: boolean;
  inStock: boolean;
  compatibleOperations: ProcessingType[];
  imageUrl?: string;
}

// Define the material category
export interface MaterialCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  materials?: Material[];
}

// Define material filter options
export interface MaterialFilterOptions {
  manufacturers: string[];
  thicknesses: number[];
  types: MaterialType[];
  minPrice: number;
  maxPrice: number;
  processingTypes: ProcessingType[];
}
