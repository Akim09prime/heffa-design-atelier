
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
  | 'other'
  // Adding conversion support for the string values coming from form
  | 'cnc_classic' 
  | 'cnc_rifled' 
  | 'glass_cut' 
  | 'glass_sandblast' 
  | 'glass_drill' 
  | 'glass_cnc'
  | 'edge_banding';

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

// Form value helper type
export type MaterialFormValues = Omit<Material, 'id' | 'inStock'> & {
  availability: boolean;
  compatibleOperations: ProcessingType[];
};
