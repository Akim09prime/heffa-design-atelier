
import { FurnitureBody, BodyPart, BodyAccessory, BodyPartType } from '@/types';

// Sample data for body presets
const sampleBodies: FurnitureBody[] = [
  {
    id: 'body-1',
    spaceId: 'space-1',
    name: 'Corp bucătărie inferior',
    width: 600,
    height: 720,
    depth: 560,
    previewImgUrl: '/assets/bodies/kitchen-base.png',
    createdFromPreset: true,
    status: 'draft',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15'),
    parts: [
      {
        id: 'part-1',
        bodyId: 'body-1',
        type: 'LatSt',
        materialId: 'mat-1',
        thickness: 18,
        hasEdge: true,
        edgeSides: ['top', 'bottom', 'front'],
        finishType: 'raw',
        pricePerPart: 45,
        faceCount: 2
      },
      {
        id: 'part-2',
        bodyId: 'body-1',
        type: 'LatDr',
        materialId: 'mat-1',
        thickness: 18,
        hasEdge: true,
        edgeSides: ['top', 'bottom', 'front'],
        finishType: 'raw',
        pricePerPart: 45,
        faceCount: 2
      },
      {
        id: 'part-3',
        bodyId: 'body-1',
        type: 'Sup',
        materialId: 'mat-1',
        thickness: 18,
        hasEdge: true,
        edgeSides: ['front', 'left', 'right'],
        finishType: 'raw',
        pricePerPart: 38,
        faceCount: 1
      },
      {
        id: 'part-4',
        bodyId: 'body-1',
        type: 'Inf',
        materialId: 'mat-1',
        thickness: 18,
        hasEdge: true,
        edgeSides: ['front', 'left', 'right'],
        finishType: 'raw',
        pricePerPart: 38,
        faceCount: 1
      },
      {
        id: 'part-5',
        bodyId: 'body-1',
        type: 'Fund',
        materialId: 'mat-2',
        thickness: 5,
        hasEdge: false,
        edgeSides: [],
        finishType: 'raw',
        pricePerPart: 25,
        faceCount: 1
      },
      {
        id: 'part-6',
        bodyId: 'body-1',
        type: 'Front',
        materialId: 'mat-3',
        thickness: 18,
        hasEdge: true,
        edgeSides: ['top', 'bottom', 'left', 'right'],
        finishType: 'raw',
        pricePerPart: 65,
        faceCount: 2
      }
    ],
    accessories: [
      {
        id: 'acc-1',
        bodyId: 'body-1',
        category: 'hinge',
        brand: 'Blum',
        system: 'Clip Top',
        sizeMm: 110,
        pricePerUnit: 15,
        quantity: 2
      },
      {
        id: 'acc-2',
        bodyId: 'body-1',
        category: 'handle',
        brand: 'Hafele',
        system: 'Modern',
        sizeMm: 192,
        pricePerUnit: 12,
        quantity: 1
      }
    ]
  }
];

// Body part template generators
const generateSidePart = (bodyId: string, materialId: string, height: number, depth: number, isLeft = true): BodyPart => {
  return {
    id: `part-${Math.random().toString(36).substring(2, 9)}`,
    bodyId,
    type: isLeft ? 'LatSt' : 'LatDr',
    materialId,
    thickness: 18,
    hasEdge: true,
    edgeSides: ['top', 'bottom', 'front'],
    finishType: 'raw',
    pricePerPart: 45,
    faceCount: 2
  };
};

const generateHorizontalPart = (bodyId: string, materialId: string, width: number, depth: number, type: 'Sup' | 'Inf'): BodyPart => {
  return {
    id: `part-${Math.random().toString(36).substring(2, 9)}`,
    bodyId,
    type,
    materialId,
    thickness: 18,
    hasEdge: true,
    edgeSides: ['front', 'left', 'right'],
    finishType: 'raw',
    pricePerPart: 38,
    faceCount: 1
  };
};

const generateBackPanel = (bodyId: string, materialId: string, width: number, height: number): BodyPart => {
  return {
    id: `part-${Math.random().toString(36).substring(2, 9)}`,
    bodyId,
    type: 'Fund',
    materialId,
    thickness: 5, // Typically thinner
    hasEdge: false,
    edgeSides: [],
    finishType: 'raw',
    pricePerPart: 25,
    faceCount: 1
  };
};

const generateFront = (bodyId: string, materialId: string, width: number, height: number): BodyPart => {
  return {
    id: `part-${Math.random().toString(36).substring(2, 9)}`,
    bodyId,
    type: 'Front',
    materialId,
    thickness: 18,
    hasEdge: true,
    edgeSides: ['top', 'bottom', 'left', 'right'],
    finishType: 'raw',
    pricePerPart: 65,
    faceCount: 2
  };
};

const generateShelf = (bodyId: string, materialId: string, width: number, depth: number): BodyPart => {
  return {
    id: `part-${Math.random().toString(36).substring(2, 9)}`,
    bodyId,
    type: 'Raft',
    materialId,
    thickness: 18,
    hasEdge: true,
    edgeSides: ['front'],
    finishType: 'raw',
    pricePerPart: 35,
    faceCount: 1
  };
};

// Body templates
const generateBasicBodyParts = (
  bodyId: string, 
  materialId: string, 
  width: number, 
  height: number, 
  depth: number
): BodyPart[] => {
  return [
    // Left side
    generateSidePart(bodyId, materialId, height, depth, true),
    // Right side
    generateSidePart(bodyId, materialId, height, depth, false),
    // Top
    generateHorizontalPart(bodyId, materialId, width, depth, 'Sup'),
    // Bottom
    generateHorizontalPart(bodyId, materialId, width, depth, 'Inf'),
    // Back panel
    generateBackPanel(bodyId, materialId, width, height),
    // Front door
    generateFront(bodyId, materialId, width, height)
  ];
};

// Standard accessories for a body
const generateStandardAccessories = (bodyId: string): BodyAccessory[] => {
  return [
    {
      id: `acc-${Math.random().toString(36).substring(2, 9)}`,
      bodyId,
      category: 'hinge',
      brand: 'Blum',
      system: 'Clip Top',
      sizeMm: 110,
      pricePerUnit: 15,
      quantity: 2
    },
    {
      id: `acc-${Math.random().toString(36).substring(2, 9)}`,
      bodyId,
      category: 'handle',
      brand: 'Hafele',
      system: 'Modern',
      sizeMm: 192,
      pricePerUnit: 12,
      quantity: 1
    }
  ];
};

export const BodyService = {
  // Get all bodies for a space
  getBodiesBySpaceId: async (spaceId: string): Promise<FurnitureBody[]> => {
    return Promise.resolve(sampleBodies.filter(body => body.spaceId === spaceId));
  },
  
  // Get a specific body by ID
  getBodyById: async (bodyId: string): Promise<FurnitureBody | null> => {
    const body = sampleBodies.find(b => b.id === bodyId);
    return Promise.resolve(body || null);
  },
  
  // Create a new body
  createBody: async (body: Omit<FurnitureBody, 'id' | 'createdAt' | 'updatedAt'>): Promise<FurnitureBody> => {
    const newBody: FurnitureBody = {
      ...body,
      id: `body-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real application, this would save to a database
    sampleBodies.push(newBody);
    
    return Promise.resolve(newBody);
  },
  
  // Update an existing body
  updateBody: async (bodyId: string, updates: Partial<FurnitureBody>): Promise<FurnitureBody> => {
    const index = sampleBodies.findIndex(b => b.id === bodyId);
    
    if (index === -1) {
      throw new Error(`Body with ID ${bodyId} not found`);
    }
    
    const updatedBody = {
      ...sampleBodies[index],
      ...updates,
      updatedAt: new Date()
    };
    
    sampleBodies[index] = updatedBody;
    
    return Promise.resolve(updatedBody);
  },
  
  // Delete a body
  deleteBody: async (bodyId: string): Promise<void> => {
    const index = sampleBodies.findIndex(b => b.id === bodyId);
    
    if (index === -1) {
      throw new Error(`Body with ID ${bodyId} not found`);
    }
    
    sampleBodies.splice(index, 1);
    
    return Promise.resolve();
  },
  
  // Generate a new body from a template
  generateFromTemplate: async (
    spaceId: string, 
    name: string,
    width: number, 
    height: number, 
    depth: number,
    materialId: string = 'mat-1'
  ): Promise<FurnitureBody> => {
    const bodyId = `body-${Math.random().toString(36).substring(2, 9)}`;
    
    const newBody: FurnitureBody = {
      id: bodyId,
      spaceId,
      name,
      width,
      height,
      depth,
      createdFromPreset: false,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      parts: generateBasicBodyParts(bodyId, materialId, width, height, depth),
      accessories: generateStandardAccessories(bodyId)
    };
    
    // In a real application, this would save to a database
    sampleBodies.push(newBody);
    
    return Promise.resolve(newBody);
  },
  
  // Add a part to a body
  addPartToBody: async (
    bodyId: string, 
    part: Omit<BodyPart, 'id' | 'bodyId'>
  ): Promise<BodyPart> => {
    const body = sampleBodies.find(b => b.id === bodyId);
    
    if (!body) {
      throw new Error(`Body with ID ${bodyId} not found`);
    }
    
    const newPart: BodyPart = {
      ...part,
      id: `part-${Math.random().toString(36).substring(2, 9)}`,
      bodyId
    };
    
    body.parts.push(newPart);
    body.updatedAt = new Date();
    
    return Promise.resolve(newPart);
  },
  
  // Add an accessory to a body
  addAccessoryToBody: async (
    bodyId: string, 
    accessory: Omit<BodyAccessory, 'id' | 'bodyId'>
  ): Promise<BodyAccessory> => {
    const body = sampleBodies.find(b => b.id === bodyId);
    
    if (!body) {
      throw new Error(`Body with ID ${bodyId} not found`);
    }
    
    const newAccessory: BodyAccessory = {
      ...accessory,
      id: `acc-${Math.random().toString(36).substring(2, 9)}`,
      bodyId
    };
    
    body.accessories.push(newAccessory);
    body.updatedAt = new Date();
    
    return Promise.resolve(newAccessory);
  },
  
  // Get available part types with translations
  getPartTypes: () => {
    return [
      { value: 'LatSt', label: 'Laterala Stanga' },
      { value: 'LatDr', label: 'Laterala Dreapta' },
      { value: 'Inf', label: 'Blat Inferior' },
      { value: 'Sup', label: 'Blat Superior' },
      { value: 'Fund', label: 'Panou Spate' },
      { value: 'Front', label: 'Front/Usa' },
      { value: 'Raft', label: 'Raft' },
      { value: 'Sertar', label: 'Sertar' }
    ];
  },
  
  // Export body as DXF
  exportBodyToDxf: async (bodyId: string): Promise<string> => {
    // In a real app, this would generate a DXF file
    return Promise.resolve(`/exports/dxf/body_${bodyId}_${Date.now()}.dxf`);
  },
  
  // Export cutting list to CSV
  exportCuttingListToCsv: async (bodyId: string): Promise<string> => {
    // In a real app, this would generate a CSV file
    return Promise.resolve(`/exports/csv/cutting_${bodyId}_${Date.now()}.csv`);
  }
};
