
import { Project, FurnitureModule, ExportFormat, Material } from '@/types';

export const ExportService = {
  // Export project data in various formats
  exportProject: (project: Project, format: ExportFormat, includeDetails: boolean = true): Promise<Blob> => {
    switch (format) {
      case 'pdf':
        return ExportService.exportToPdf(project, includeDetails);
      case 'excel':
        return ExportService.exportToExcel(project, includeDetails);
      case 'dxf':
        return ExportService.exportToDxf(project);
      case 'svg':
        return ExportService.exportToSvg(project);
      case 'json':
        return ExportService.exportToJson(project);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  },
  
  // Export to PDF (client offer or cutting sheets)
  exportToPdf: async (project: Project, includeDetails: boolean): Promise<Blob> => {
    // This would normally use a PDF generation library like pdfmake or jsPDF
    console.log('Exporting project to PDF', { project, includeDetails });
    
    // Mock PDF export (in reality, we'd generate an actual PDF)
    const mockPdfContent = `
      Project: ${project.name}
      Description: ${project.description}
      Room Type: ${project.roomType}
      Number of Modules: ${project.modules.length}
      ${includeDetails ? 'Detailed information for each module...' : ''}
    `;
    
    // Return a mock PDF blob
    return new Blob([mockPdfContent], { type: 'application/pdf' });
  },
  
  // Export to Excel (cutting lists, accessory lists)
  exportToExcel: async (project: Project, includeDetails: boolean): Promise<Blob> => {
    // This would normally use a library like xlsx or exceljs
    console.log('Exporting project to Excel', { project, includeDetails });
    
    // Mock Excel export
    const mockExcelContent = `Project,${project.name}
      Module,Type,Width,Height,Depth,Material,Quantity
      ${project.modules.map(module => 
        `${module.name},${module.type},${module.width},${module.height},${module.depth},Materials...`
      ).join('\n')}
    `;
    
    // Return a mock Excel blob
    return new Blob([mockExcelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  },
  
  // Export to DXF (CNC cutting files)
  exportToDxf: async (project: Project): Promise<Blob> => {
    console.log('Exporting project to DXF', { project });
    
    // Mock DXF export
    const mockDxfContent = 'DXF file content for CNC machine';
    
    // Return a mock DXF blob
    return new Blob([mockDxfContent], { type: 'application/dxf' });
  },
  
  // Export to SVG (visual representation)
  exportToSvg: async (project: Project): Promise<Blob> => {
    console.log('Exporting project to SVG', { project });
    
    // Mock SVG export
    const mockSvgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <text x="10" y="20" font-family="Arial" font-size="16">${project.name}</text>
        <!-- More SVG content would be generated here -->
      </svg>
    `;
    
    // Return a mock SVG blob
    return new Blob([mockSvgContent], { type: 'image/svg+xml' });
  },
  
  // Export to JSON (complete project backup)
  exportToJson: async (project: Project): Promise<Blob> => {
    console.log('Exporting project to JSON', { project });
    
    // Convert project to JSON
    const projectJson = JSON.stringify(project, null, 2);
    
    // Return JSON blob
    return new Blob([projectJson], { type: 'application/json' });
  },
  
  // Generate a client offer PDF
  generateClientOffer: async (
    project: Project, 
    materials: Material[], 
    clientInfo: { name: string, email: string, phone: string }
  ): Promise<Blob> => {
    console.log('Generating client offer PDF', { project, clientInfo });
    
    // This would normally create a detailed PDF with pricing, materials, etc.
    const mockOfferContent = `
      CLIENT OFFER
      
      Client: ${clientInfo.name}
      Contact: ${clientInfo.email} | ${clientInfo.phone}
      
      Project: ${project.name}
      Description: ${project.description}
      
      MODULES:
      ${project.modules.map(module => 
        `- ${module.name}: ${module.width}x${module.height}x${module.depth}mm - €${module.price.toFixed(2)}`
      ).join('\n')}
      
      TOTAL PRICE: €${project.modules.reduce((sum, module) => sum + module.price, 0).toFixed(2)}
    `;
    
    // Return a mock PDF blob
    return new Blob([mockOfferContent], { type: 'application/pdf' });
  },
  
  // Generate cutting sheets for suppliers
  generateCuttingSheets: async (project: Project, materials: Material[]): Promise<Blob> => {
    console.log('Generating cutting sheets', { project });
    
    // Mock cutting sheet content
    const mockCuttingSheetContent = `
      CUTTING SHEETS
      
      Project: ${project.name}
      
      PAL CUTTING:
      ${project.modules.flatMap(module => 
        module.materials
          .filter(mat => {
            const material = materials.find(m => m.id === mat.materialId);
            return material && material.type === 'PAL';
          })
          .map(mat => `- ${mat.part}: ${mat.quantity}m²`)
      ).join('\n')}
      
      MDF CUTTING:
      ${project.modules.flatMap(module => 
        module.materials
          .filter(mat => {
            const material = materials.find(m => m.id === mat.materialId);
            return material && (material.type === 'MDF' || material.type === 'MDF-AGT');
          })
          .map(mat => `- ${mat.part}: ${mat.quantity}m²`)
      ).join('\n')}
    `;
    
    // Return a mock Excel blob
    return new Blob([mockCuttingSheetContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
};
