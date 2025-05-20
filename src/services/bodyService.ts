
import { v4 as uuidv4 } from 'uuid';
import { FurnitureBody, BodyPart, BodyAccessory } from '@/types';

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
          name: "Laterală stânga",
          material: "PAL",
          thickness: 18,
          width: depth,
          height,
          position: "left", // Changed from "front" to "left"
          edge: { top: true, right: true, bottom: true, left: false },
        },
        {
          id: uuidv4(),
          name: "Laterală dreapta",
          material: "PAL",
          thickness: 18,
          width: depth,
          height,
          position: "right", // Changed from "front" to "right"
          edge: { top: true, right: false, bottom: true, left: true },
        },
        {
          id: uuidv4(),
          name: "Blat superior",
          material: "PAL",
          thickness: 18,
          width: width - 36,
          height: depth,
          position: "top", // Changed from "front" to "top"
          edge: { top: true, right: false, bottom: true, left: false },
        },
        {
          id: uuidv4(),
          name: "Blat inferior",
          material: "PAL",
          thickness: 18,
          width: width - 36,
          height: depth,
          position: "bottom", // Changed from "front" to "bottom"
          edge: { top: true, right: false, bottom: true, left: false },
        }
      ],
      accessories: [
        {
          id: uuidv4(),
          name: "Balama standard",
          type: "hinge",
          quantity: 4,
          price: 10,
        },
        {
          id: uuidv4(),
          name: "Mâner mobilier",
          type: "handle",
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
        position: part.position as "left" | "right" | "top" | "bottom", // Ensure position is valid
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
    
    // Convert any "front" position to "left" for compatibility
    if (bodyUpdates.parts) {
      bodyUpdates.parts = bodyUpdates.parts.map(part => ({
        ...part,
        position: (part.position === "front" ? "left" : part.position) as "left" | "right" | "top" | "bottom",
      }));
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
    
    // Convert "front" position to "left" for compatibility
    const position = part.position === "front" ? "left" : part.position;
    
    const newPart: BodyPart = {
      ...part,
      id: uuidv4(),
      position: position as "left" | "right" | "top" | "bottom",
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
