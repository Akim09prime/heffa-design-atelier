
// Body types
export interface BodyPart {
  id: string;
  type: string;
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
  position: "left" | "right" | "top" | "bottom";
}

export interface BodyAccessory {
  id: string;
  type: string;
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
