
// Add these declarations to your types
declare module 'jspdf-autotable' {
  import jsPDF from 'jspdf';
  
  interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: number;
    pageBreak?: 'auto' | 'avoid';
    rowPageBreak?: 'auto' | 'avoid';
    tableWidth?: 'auto' | 'wrap' | number;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    theme?: string;
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    didParseCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    didDrawPage?: (data: any) => void;
  }
  
  const autoTable: (pdf: jsPDF, options: UserOptions) => any;
  export default autoTable;
}

import { 
  BodyPart, 
  BodyAccessory, 
  FurnitureBody, 
  BodyPartType, 
  BodyPartPosition,
  AccessoryType
} from './body';

// Re-export types from body.d.ts
export { 
  BodyPart, 
  BodyAccessory, 
  FurnitureBody, 
  BodyPartType, 
  BodyPartPosition,
  AccessoryType
};
