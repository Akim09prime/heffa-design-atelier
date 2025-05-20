
import { Project } from '@/types';

export interface Space {
  id: string;
  projectId: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  includePipe: boolean;
  includeFaucets: boolean;
  includeCornice: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for spaces
const sampleSpaces: Space[] = [
  {
    id: 'space-1',
    projectId: '1',
    name: 'Bucătărie',
    width: 3500,
    height: 2400,
    depth: 600,
    includePipe: true,
    includeFaucets: true,
    includeCornice: false,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: 'space-2',
    projectId: '1',
    name: 'Dormitor',
    width: 4000,
    height: 2400,
    depth: 600,
    includePipe: false,
    includeFaucets: false,
    includeCornice: true,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: 'space-3',
    projectId: '2',
    name: 'Dresing',
    width: 2500,
    height: 2400,
    depth: 600,
    includePipe: false,
    includeFaucets: false,
    includeCornice: false,
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10')
  }
];

export const SpaceService = {
  // Get all spaces
  getAllSpaces: async (): Promise<Space[]> => {
    return Promise.resolve([...sampleSpaces]);
  },

  // Get spaces by project ID
  getSpacesByProjectId: async (projectId: string): Promise<Space[]> => {
    return Promise.resolve(sampleSpaces.filter(space => space.projectId === projectId));
  },

  // Get space by ID
  getSpaceById: async (id: string): Promise<Space | null> => {
    const space = sampleSpaces.find(space => space.id === id);
    return Promise.resolve(space || null);
  },

  // Create new space
  createSpace: async (space: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>): Promise<Space> => {
    const newSpace = {
      ...space,
      id: `space-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Here we'd add the space to the database
    console.log('Creating new space:', newSpace);
    
    // Add the space to sampleSpaces for the demo
    sampleSpaces.push(newSpace as Space);
    
    return Promise.resolve(newSpace as Space);
  },

  // Update space
  updateSpace: async (id: string, space: Partial<Space>): Promise<Space> => {
    // Find the space to update
    const existingSpaceIndex = sampleSpaces.findIndex(s => s.id === id);
    
    if (existingSpaceIndex === -1) {
      throw new Error(`Space with ID ${id} not found`);
    }
    
    // Create updated space
    const updatedSpace = {
      ...sampleSpaces[existingSpaceIndex],
      ...space,
      updatedAt: new Date()
    };
    
    // Here we'd update the space in the database
    sampleSpaces[existingSpaceIndex] = updatedSpace;
    
    return Promise.resolve(updatedSpace);
  },

  // Delete space
  deleteSpace: async (id: string): Promise<void> => {
    // Find the space index
    const spaceIndex = sampleSpaces.findIndex(s => s.id === id);
    
    if (spaceIndex === -1) {
      throw new Error(`Space with ID ${id} not found`);
    }
    
    // Here we'd delete the space from the database
    sampleSpaces.splice(spaceIndex, 1);
    
    return Promise.resolve();
  }
};
