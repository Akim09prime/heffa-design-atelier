
import { Material, MaterialType, ProcessingType } from '@/types';

// Sample materials data with better image URLs
export const sampleMaterials: Material[] = [
  {
    id: '1',
    code: 'PAL-W980-ST2-18',
    name: 'Alb W980 ST2',
    manufacturer: 'Egger',
    type: 'PAL',
    thickness: 18,
    pricePerSqm: 38.50,
    availability: true,
    paintable: false,
    cantable: true,
    compatibleOperations: ['edge_banding'],
    supplier: 'Egger',
    textureUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=500',
  },
  {
    id: '2',
    code: 'PAL-H3331-ST10-18',
    name: 'Stejar Nebraska',
    manufacturer: 'Egger',
    type: 'PAL',
    thickness: 18,
    pricePerSqm: 42.30,
    availability: true,
    paintable: false,
    cantable: true,
    compatibleOperations: ['edge_banding'],
    supplier: 'Egger',
    textureUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=500',
  },
  {
    id: '3',
    code: 'PAL-U702-ST9-18',
    name: 'Cashmere Grey',
    manufacturer: 'Egger',
    type: 'PAL',
    thickness: 18,
    pricePerSqm: 39.80,
    availability: true,
    paintable: false,
    cantable: true,
    compatibleOperations: ['edge_banding'],
    supplier: 'Egger',
    textureUrl: 'https://images.unsplash.com/photo-1526644253653-a411eeb2f73c?q=80&w=500',
  },
  {
    id: '4',
    code: 'MDF-18',
    name: 'MDF Standard',
    manufacturer: 'Kronospan',
    type: 'MDF',
    thickness: 18,
    pricePerSqm: 35.20,
    availability: true,
    paintable: true,
    cantable: false,
    compatibleOperations: ['cnc_classic', 'cnc_rifled', 'painting'],
    supplier: 'Other',
    textureUrl: 'https://images.unsplash.com/photo-1561013322-ec7bcd618164?q=80&w=500',
  },
  {
    id: '5',
    code: 'MDF-AGT-22',
    name: 'MDF AGT Ultra',
    manufacturer: 'AGT',
    type: 'MDF-AGT',
    thickness: 22,
    pricePerSqm: 68.90,
    availability: true,
    paintable: false,
    cantable: true,
    compatibleOperations: ['edge_banding'],
    supplier: 'AGT',
    textureUrl: 'https://images.unsplash.com/photo-1557316366-941515c8bc22?q=80&w=500',
  },
  {
    id: '6',
    code: 'PFL-3',
    name: 'PFL Standard',
    manufacturer: 'Kronospan',
    type: 'PFL',
    thickness: 3,
    pricePerSqm: 18.50,
    availability: true,
    paintable: false,
    cantable: false,
    compatibleOperations: [],
    supplier: 'Other',
    textureUrl: 'https://images.unsplash.com/photo-1535932670072-8e1d69f6c9fb?q=80&w=500',
  },
  {
    id: '7',
    code: 'GLASS-FLOAT-6',
    name: 'Float Glass Clear',
    manufacturer: 'SticlaExpert',
    type: 'GLASS',
    thickness: 6,
    pricePerSqm: 75.00,
    availability: true,
    paintable: false,
    cantable: false,
    compatibleOperations: ['glass_cut', 'glass_sandblast', 'glass_drill', 'glass_cnc'],
    supplier: 'SticlaExpert',
    textureUrl: 'https://images.unsplash.com/photo-1520785643438-5bf77931f493?q=80&w=500',
  },
  {
    id: '8',
    code: 'GLASS-SATIN-6',
    name: 'Satin Glass',
    manufacturer: 'SticlaExpert',
    type: 'GLASS',
    thickness: 6,
    pricePerSqm: 95.00,
    availability: true,
    paintable: false,
    cantable: false,
    compatibleOperations: ['glass_cut', 'glass_drill', 'glass_cnc'],
    supplier: 'SticlaExpert',
    textureUrl: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=500',
  },
  {
    id: '9',
    code: 'CT-SALICE-38',
    name: 'Black Marble Countertop',
    manufacturer: 'Salice',
    type: 'COUNTERTOP',
    thickness: 38,
    pricePerSqm: 185.00,
    availability: true,
    paintable: false,
    cantable: true,
    compatibleOperations: ['edge_banding'],
    supplier: 'Other',
    textureUrl: 'https://images.unsplash.com/photo-1591892250004-d58a0a28d19c?q=80&w=500',
  },
];

// Define Material Service
export const MaterialService = {
  // Get all materials
  getAllMaterials: async (): Promise<Material[]> => {
    // In a real app, this would be an API call
    return Promise.resolve([...sampleMaterials]);
  },

  // Get materials by type
  getMaterialsByType: async (type: MaterialType): Promise<Material[]> => {
    // In a real app, this would be an API call with filtering
    return Promise.resolve(sampleMaterials.filter(material => material.type === type));
  },

  // Add new material
  addMaterial: async (material: Omit<Material, 'id'>): Promise<Material> => {
    // In a real app, this would be an API call
    const newMaterial = {
      ...material,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    // Set default image if none provided
    if (!newMaterial.textureUrl) {
      newMaterial.textureUrl = 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=500';
    }
    
    // Here we'd add the material to the database
    console.log('Adding new material:', newMaterial);
    
    // Add the new material to our local sample data
    sampleMaterials.push(newMaterial as Material);
    
    return Promise.resolve(newMaterial as Material);
  },

  // Update material
  updateMaterial: async (id: string, material: Partial<Material>): Promise<Material> => {
    // In a real app, this would be an API call
    console.log(`Updating material ${id}:`, material);
    
    // Find the material to update
    const existingMaterialIndex = sampleMaterials.findIndex(m => m.id === id);
    
    if (existingMaterialIndex === -1) {
      throw new Error(`Material with ID ${id} not found`);
    }
    
    // Create updated material
    const updatedMaterial = {
      ...sampleMaterials[existingMaterialIndex],
      ...material,
    };
    
    // Update the material in our local sample data
    sampleMaterials[existingMaterialIndex] = updatedMaterial;
    
    return Promise.resolve(updatedMaterial);
  },

  // Delete material
  deleteMaterial: async (id: string): Promise<void> => {
    // In a real app, this would be an API call
    console.log(`Deleting material ${id}`);
    
    // Find the material index
    const materialIndex = sampleMaterials.findIndex(m => m.id === id);
    
    if (materialIndex === -1) {
      throw new Error(`Material with ID ${id} not found`);
    }
    
    // Remove the material from our local sample data
    sampleMaterials.splice(materialIndex, 1);
    
    return Promise.resolve();
  }
};
