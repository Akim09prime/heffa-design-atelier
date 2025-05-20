
// Define the allowed part types
export type BodyPartType = "side" | "top" | "bottom" | "shelf" | "door" | "drawer" | "back";

// Define the allowed part positions
export type BodyPartPosition = "left" | "right" | "top" | "bottom" | "front" | "back" | "middle";

// Define the allowed accessory types
export type BodyAccessoryType = "hinge" | "handle" | "drawer_slide" | "connector" | "support" | "other";

// Body types
export interface BodyPart {
  id: string;
  type: BodyPartType;
  material: string;
  thickness: number;
  width: number;
  height: number;
  edge: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  position: BodyPartPosition;
}

export interface BodyAccessory {
  id: string;
  type: BodyAccessoryType;
  quantity: number;
  price: number;
}

export interface FurnitureBody {
  id: string;
  spaceId: string;
  name: string;
  type: string;
  width: number;
  height: number;
  depth: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  parts: BodyPart[];
  accessories: BodyAccessory[];
  createdAt: Date;
  updatedAt: Date;
  previewImgUrl: string | null;
}
