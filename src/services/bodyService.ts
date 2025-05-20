import { v4 as uuidv4 } from 'uuid';
import { FurnitureBody, BodyPart, BodyAccessory, BodyPartType, BodyPartPosition, AccessoryType } from '@/types';

// Mock database
let bodies: FurnitureBody[] = [];

export const BodyService = {
  // Get all bodies
  getAllBodies: async (): Promise<FurnitureBody[]> => {
    return [...bodies];
  },

  // Get bodies by space ID
  getBodiesBySpaceId: async (spaceId: string): Promise<FurnitureBody[]> => {
    return bodies.filter(body => body.spaceId === spaceId);
  },

  // Get body by ID
  getBodyById: async (id: string): Promise<FurnitureBody | undefined> => {
    return bodies.find(body => body.id === id);
  },
  
  // Generate body from template
  generateFromTemplate: async (
    spaceId: string, 
    name: string, 
    width: number, 
    height: number, 
    depth: number,
    materialId: string
  ): Promise<FurnitureBody> => {
    return BodyService.createStandardWardrobe(spaceId, width, height, depth);
  },
  
  // Get available part types
  getPartTypes: async (): Promise<BodyPartType[]> => {
    return (["side", "top", "bottom", "shelf", "door", "drawer", "back"] as BodyPartType[]);
  },

  // Create standard wardrobe body
  createStandardWardrobe: async (spaceId: string, width: number, height: number, depth: number): Promise<FurnitureBody> => {
    const newBody: FurnitureBody = {
      id: uuidv4(),
      spaceId,
      name: "Dulap standard",
      type: "wardrobe",
      width,
      height,
      depth,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      parts: [
        {
          id: uuidv4(),
          type: "side" as BodyPartType,
          materialId: "PAL",
          thickness: 18,
          width: depth,
          height,
          edge: { top: true, right: true, bottom: true, left: false },
          position: "left" as BodyPartPosition,
          material: "PAL", // For backward compatibility
        },
        {
          id: uuidv4(),
          type: "side" as BodyPartType,
          materialId: "PAL",
          thickness: 18,
          width: depth,
          height,
          edge: { top: true, right: false, bottom: true, left: true },
          position: "right" as BodyPartPosition,
          material: "PAL", // For backward compatibility
        },
        {
          id: uuidv4(),
          type: "top" as BodyPartType,
          materialId: "PAL",
          thickness: 18,
          width: width - 36,
          height: depth,
          edge: { top: true, right: false, bottom: true, left: false },
          position: "top" as BodyPartPosition,
          material: "PAL", // For backward compatibility
        },
        {
          id: uuidv4(),
          type: "bottom" as BodyPartType,
          materialId: "PAL",
          thickness: 18,
          width: width - 36,
          height: depth,
          edge: { top: true, right: false, bottom: true, left: false },
          position: "bottom" as BodyPartPosition,
          material: "PAL", // For backward compatibility
        }
      ],
      accessories: [
        {
          id: uuidv4(),
          type: "hinge" as AccessoryType,
          quantity: 4,
          price: 10,
        },
        {
          id: uuidv4(),
          type: "handle" as AccessoryType,
          quantity: 2,
          price: 15,
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      previewImgUrl: null,
    };
    
    bodies.push(newBody);
    return newBody;
  },
  
  // Create custom body
  createCustomBody: async (body: Omit<FurnitureBody, 'id' | 'createdAt' | 'updatedAt'>): Promise<FurnitureBody> => {
    const newBody: FurnitureBody = {
      ...body,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      parts: body.parts.map(part => ({
        ...part,
        id: part.id || uuidv4(),
      })),
      accessories: body.accessories.map(acc => ({
        ...acc,
        id: acc.id || uuidv4(),
      })),
    };
    
    bodies.push(newBody);
    return newBody;
  },
  
  // Update body
  updateBody: async (id: string, bodyUpdates: Partial<FurnitureBody>): Promise<FurnitureBody> => {
    const index = bodies.findIndex(body => body.id === id);
    if (index === -1) {
      throw new Error(`Body with id ${id} not found`);
    }
    
    bodies[index] = {
      ...bodies[index],
      ...bodyUpdates,
      updatedAt: new Date(),
    };
    
    return bodies[index];
  },
  
  // Delete body
  deleteBody: async (id: string): Promise<void> => {
    const index = bodies.findIndex(body => body.id === id);
    if (index !== -1) {
      bodies.splice(index, 1);
    }
  },
  
  // Add part to body
  addPartToBody: async (bodyId: string, part: Omit<BodyPart, 'id'>): Promise<BodyPart> => {
    const body = bodies.find(b => b.id === bodyId);
    if (!body) {
      throw new Error(`Body with id ${bodyId} not found`);
    }
    
    const newPart: BodyPart = {
      ...part,
      id: uuidv4(),
    };
    
    body.parts.push(newPart);
    body.updatedAt = new Date();
    
    return newPart;
  },
  
  // Remove part from body
  removePartFromBody: async (bodyId: string, partId: string): Promise<void> => {
    const body = bodies.find(b => b.id === bodyId);
    if (!body) {
      throw new Error(`Body with id ${bodyId} not found`);
    }
    
    const partIndex = body.parts.findIndex(p => p.id === partId);
    if (partIndex !== -1) {
      body.parts.splice(partIndex, 1);
      body.updatedAt = new Date();
    }
  },
  
  // Add accessory to body
  addAccessoryToBody: async (bodyId: string, accessory: Omit<BodyAccessory, 'id'>): Promise<BodyAccessory> => {
    const body = bodies.find(b => b.id === bodyId);
    if (!body) {
      throw new Error(`Body with id ${bodyId} not found`);
    }
    
    const newAccessory: BodyAccessory = {
      ...accessory,
      id: uuidv4(),
    };
    
    body.accessories.push(newAccessory);
    body.updatedAt = new Date();
    
    return newAccessory;
  },
  
  // Remove accessory from body
  removeAccessoryFromBody: async (bodyId: string, accessoryId: string): Promise<void> => {
    const body = bodies.find(b => b.id === bodyId);
    if (!body) {
      throw new Error(`Body with id ${bodyId} not found`);
    }
    
    const accessoryIndex = body.accessories.findIndex(a => a.id === accessoryId);
    if (accessoryIndex !== -1) {
      body.accessories.splice(accessoryIndex, 1);
      body.updatedAt = new Date();
    }
  },
  
  // Export body to DXF
  exportBodyToDxf: async (bodyId: string): Promise<string> => {
    // In a real implementation, this would generate a DXF file
    // Here we just return a mock URL
    return `/exports/body_${bodyId}.dxf`;
  }
};
