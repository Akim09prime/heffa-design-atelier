
import { AccessoryItem, AccessoryType } from '@/types';

// Initial sample accessories data
const initialAccessories: AccessoryItem[] = [
  // Hinges (Balamale)
  {
    id: '1',
    code: 'BL-HG-CLIPTOP-110',
    name: 'Blum ClipTop Hinge 110°',
    type: 'hinge',
    manufacturer: 'Blum',
    price: 13.20,
    imageUrl: 'https://images.unsplash.com/photo-1621600411688-4be93c2c1208?q=80&w=300',
    pdfUrl: '/pdfs/blum-cliptop-110.pdf',
    compatibility: ['base_cabinet', 'wall_cabinet', 'tall_cabinet'],
    properties: {
      openAngle: 110,
      softClose: true,
      includesMountPlate: true,
      material: 'metal'
    }
  },
  {
    id: '2',
    code: 'HF-HG-METALLA-95',
    name: 'Hafele Metalla Hinge 95°',
    type: 'hinge',
    manufacturer: 'Hafele',
    price: 10.50,
    imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=300',
    compatibility: ['base_cabinet', 'wall_cabinet'],
    properties: {
      openAngle: 95,
      softClose: false,
      includesMountPlate: false,
      material: 'metal'
    }
  },

  // Slides (Glisiere)
  {
    id: '3',
    code: 'BL-GL-TB-500',
    name: 'Blum TandemBox 500mm',
    type: 'slide',
    manufacturer: 'Blum',
    price: 46.90,
    imageUrl: 'https://images.unsplash.com/photo-1596394723269-3f90199b45e4?q=80&w=300',
    pdfUrl: '/pdfs/blum-tandembox-500.pdf',
    compatibility: ['drawer_unit', 'base_cabinet'],
    properties: {
      length: 500,
      loadCapacity: 30,
      softClose: true,
      fullExtension: true
    }
  },
  {
    id: '4',
    code: 'HF-GL-QUADRO-450',
    name: 'Hafele Quadro 450mm',
    type: 'slide',
    manufacturer: 'Hafele',
    price: 38.50,
    imageUrl: 'https://images.unsplash.com/photo-1581091159529-14dc249c32d2?q=80&w=300',
    compatibility: ['drawer_unit', 'base_cabinet'],
    properties: {
      length: 450,
      loadCapacity: 25,
      softClose: true,
      fullExtension: true
    }
  },

  // Push Systems
  {
    id: '5',
    code: 'GTV-PUSH-MAG',
    name: 'GTV Push System Magnetic',
    type: 'push_system',
    manufacturer: 'GTV',
    price: 5.80,
    imageUrl: 'https://images.unsplash.com/photo-1611288875785-d97cd9dd98d1?q=80&w=300',
    compatibility: ['base_cabinet', 'wall_cabinet', 'tall_cabinet'],
    properties: {
      type: 'magnetic',
      strength: 'medium',
      color: 'gray'
    }
  },

  // Feet
  {
    id: '6',
    code: 'LG-REG-100-BLACK',
    name: 'Adjustable Foot 100mm Black',
    type: 'foot',
    manufacturer: 'Other',
    price: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=300',
    compatibility: ['base_cabinet', 'drawer_unit', 'tall_cabinet'],
    properties: {
      height: 100,
      adjustable: true,
      material: 'plastic',
      color: 'black',
      maxLoad: 50
    }
  },

  // Profiles
  {
    id: '7',
    code: 'PRF-ALU-GLASS',
    name: 'Aluminum Glass Door Profile',
    type: 'profile',
    manufacturer: 'Other',
    price: 15.20,
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=300',
    compatibility: ['wall_cabinet', 'base_cabinet', 'tall_cabinet'],
    properties: {
      material: 'aluminum',
      length: 1000,
      width: 20,
      glassThickness: 4,
      color: 'silver'
    }
  },

  // Shelf Supports
  {
    id: '8',
    code: 'SUP-RAFT-5MM',
    name: 'Shelf Support Pins 5mm',
    type: 'shelf_support',
    manufacturer: 'Other',
    price: 0.80,
    imageUrl: 'https://images.unsplash.com/photo-1614853035846-79ee126fc7a6?q=80&w=300',
    compatibility: ['base_cabinet', 'wall_cabinet', 'tall_cabinet', 'shelf_unit'],
    properties: {
      diameter: 5,
      material: 'metal',
      maxLoad: 15,
      type: 'pin'
    }
  },

  // Handles
  {
    id: '9',
    code: 'HND-PROF-128-INOX',
    name: 'Profile Handle 128mm Inox',
    type: 'handle',
    manufacturer: 'GTV',
    price: 7.40,
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=300',
    compatibility: ['base_cabinet', 'wall_cabinet', 'tall_cabinet', 'drawer_unit'],
    properties: {
      length: 128,
      material: 'stainless steel',
      type: 'profile',
      color: 'inox'
    }
  },
];

// Create a mutable copy of the initial data that will be modified by the service
let accessoriesData: AccessoryItem[] = [...initialAccessories];

// Define Accessory Service
export const AccessoryService = {
  // Get all accessories
  getAllAccessories: async (): Promise<AccessoryItem[]> => {
    // Return the current state of accessories
    return Promise.resolve([...accessoriesData]);
  },

  // Get accessories by type
  getAccessoriesByType: async (type: AccessoryType): Promise<AccessoryItem[]> => {
    return Promise.resolve(accessoriesData.filter(acc => acc.type === type));
  },
  
  // Get accessories by compatibility
  getAccessoriesByCompatibility: async (moduleType: string): Promise<AccessoryItem[]> => {
    return Promise.resolve(accessoriesData.filter(
      acc => acc.compatibility.includes(moduleType as any)
    ));
  },

  // Add new accessory
  addAccessory: async (accessory: Omit<AccessoryItem, 'id'>): Promise<AccessoryItem> => {
    const newAccessory = {
      ...accessory,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    // Add the new accessory to our data array
    accessoriesData.push(newAccessory);
    
    console.log('Adding new accessory:', newAccessory);
    
    return Promise.resolve(newAccessory);
  },

  // Update accessory
  updateAccessory: async (id: string, accessory: Partial<AccessoryItem>): Promise<AccessoryItem> => {
    console.log(`Updating accessory ${id}:`, accessory);
    
    // Find the accessory to update
    const existingAccessoryIndex = accessoriesData.findIndex(a => a.id === id);
    
    if (existingAccessoryIndex === -1) {
      throw new Error(`Accessory with ID ${id} not found`);
    }
    
    // Create updated accessory
    const updatedAccessory = {
      ...accessoriesData[existingAccessoryIndex],
      ...accessory,
    };
    
    // Update the accessory in our data array
    accessoriesData[existingAccessoryIndex] = updatedAccessory;
    
    return Promise.resolve(updatedAccessory);
  },

  // Delete accessory
  deleteAccessory: async (id: string): Promise<void> => {
    console.log(`Deleting accessory ${id}`);
    
    // Remove the accessory from our data array
    accessoriesData = accessoriesData.filter(acc => acc.id !== id);
    
    return Promise.resolve();
  },
  
  // Reset to initial data (useful for testing)
  resetToInitial: async (): Promise<void> => {
    accessoriesData = [...initialAccessories];
    return Promise.resolve();
  }
};

// For backward compatibility
export const sampleAccessories = initialAccessories;
