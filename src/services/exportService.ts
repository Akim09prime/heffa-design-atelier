
import { Project, FurnitureModule, AccessoryItem } from '@/types';

// Export formats
type ExportFormat = 'pdf' | 'excel' | 'dxf' | 'svg' | 'json';

// Export config interface
interface ExportConfig {
  format: ExportFormat;
  includeDetails: boolean;
  includeImages: boolean;
  includeAccessories: boolean;
  includeCutting: boolean;
}

// Default export config
const defaultConfig: ExportConfig = {
  format: 'pdf',
  includeDetails: true,
  includeImages: true,
  includeAccessories: true,
  includeCutting: true
};

// Export options interface for the new export method
export interface ExportOptions {
  filename: string;
  format: ExportFormat;
  project: Project;
  settings: Record<string, any>;
}

// Export result interface
export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  message?: string;
}

// Export Service
export const ExportService = {
  // New unified export method
  exportProject: async (options: ExportOptions): Promise<ExportResult> => {
    const { format, project, settings } = options;
    
    console.log(`Exporting project ${project.id} in ${format} format with settings:`, settings);
    
    // Call the appropriate export method based on format
    try {
      let result: string | string[] = '';
      
      switch (format) {
        case 'pdf':
          result = await ExportService.generatePdfOffer(project, {
            includeDetails: settings.includeMaterials || settings.includeRenderings,
            includeImages: settings.includeRenderings,
            includeAccessories: settings.includeAccessories || true,
            includeCutting: settings.includeAssembly || true
          });
          return { 
            success: true, 
            downloadUrl: result,
            message: 'PDF export completed successfully'
          };
          
        case 'excel':
          result = await ExportService.generateExcelCuttingSheet(project, {
            includeDetails: settings.includeMaterials,
            includeAccessories: settings.includeAccessories,
            includeCutting: settings.includeProcessing
          });
          return { 
            success: true, 
            downloadUrl: result,
            message: 'Excel export completed successfully'
          };
          
        case 'dxf':
          const dxfResults = await ExportService.generateDxfFiles(project, {
            includeDetails: false
          });
          // For DXF, we may have multiple files, one per part
          // Here we return the first one for simplicity or create a zip in a real app
          return { 
            success: true, 
            downloadUrl: dxfResults[0] || '',
            message: `${dxfResults.length} DXF file(s) generated successfully`
          };
          
        case 'json':
          result = await ExportService.exportAsJson(project);
          const jsonBlob = new Blob([result], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          return {
            success: true,
            downloadUrl: jsonUrl,
            message: 'JSON export completed successfully'
          };
          
        default:
          return {
            success: false,
            message: `Unsupported export format: ${format}`
          };
      }
    } catch (error) {
      console.error(`Export failed for format ${format}:`, error);
      return {
        success: false,
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
  
  // Generate PDF offer
  generatePdfOffer: async (project: Project, config: Partial<ExportConfig> = {}): Promise<string> => {
    const exportConfig = { ...defaultConfig, ...config, format: 'pdf' };
    
    // In a real app, this would generate a PDF using a library
    console.log('Generating PDF offer for project:', project.id, 'with config:', exportConfig);
    
    // Return mock PDF URL
    return Promise.resolve(`/exports/pdf/project_${project.id}_${Date.now()}.pdf`);
  },
  
  // Generate Excel cutting sheet
  generateExcelCuttingSheet: async (project: Project, config: Partial<ExportConfig> = {}): Promise<string> => {
    const exportConfig = { ...defaultConfig, ...config, format: 'excel' };
    
    // In a real app, this would generate an Excel file using a library
    console.log('Generating Excel cutting sheet for project:', project.id, 'with config:', exportConfig);
    
    // Return mock Excel URL
    return Promise.resolve(`/exports/excel/cutting_${project.id}_${Date.now()}.xlsx`);
  },
  
  // Generate DXF files for CNC
  generateDxfFiles: async (project: Project, config: Partial<ExportConfig> = {}): Promise<string[]> => {
    const exportConfig = { ...defaultConfig, ...config, format: 'dxf' };
    
    // In a real app, this would generate DXF files for CNC machines
    console.log('Generating DXF files for project:', project.id, 'with config:', exportConfig);
    
    // Find modules that need CNC processing
    const modulesNeedingCnc = project.modules.filter(module => 
      module.processingOptions.some(p => p.type.includes('cnc'))
    );
    
    // Return mock DXF URLs
    return Promise.resolve(modulesNeedingCnc.map(module => 
      `/exports/dxf/${project.id}_${module.id}_${Date.now()}.dxf`
    ));
  },
  
  // Export project as JSON
  exportAsJson: async (project: Project): Promise<string> => {
    // In a real app, this would properly format and save the JSON data
    const projectJson = JSON.stringify(project, null, 2);
    console.log('Exporting project as JSON:', project.id);
    
    // In a browser environment, this would trigger a download
    // Mock implementation returns the JSON string
    return Promise.resolve(projectJson);
  },
  
  // Generate a ZIP file with all exports
  generateZipBundle: async (project: Project): Promise<string> => {
    // In a real app, this would generate all export types and bundle them
    console.log('Generating ZIP bundle for project:', project.id);
    
    // Return mock ZIP URL
    return Promise.resolve(`/exports/zip/${project.id}_complete_${Date.now()}.zip`);
  },
  
  // Email exports to recipients
  emailExports: async (
    project: Project, 
    recipientEmail: string, 
    exportTypes: ExportFormat[], 
    message: string = ''
  ): Promise<boolean> => {
    // In a real app, this would generate the requested exports and email them
    console.log('Emailing exports to:', recipientEmail);
    console.log('Export types:', exportTypes);
    console.log('Message:', message);
    
    // Mock successful email
    return Promise.resolve(true);
  },
  
  // Preview PDF before sending
  previewPdf: async (project: Project): Promise<string> => {
    // In a real app, this would generate a temporary PDF for preview
    console.log('Generating PDF preview for project:', project.id);
    
    // Return mock PDF data URL that could be displayed in an iframe
    return Promise.resolve('data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG...');
  },
  
  // Generate cutting list for furniture manufacturing
  generateCuttingList: async (project: Project): Promise<Record<string, any>> => {
    console.log('Generating cutting list for project:', project.id);
    
    // Mock cutting list data
    const cuttingList = project.modules.map(module => ({
      moduleId: module.id,
      moduleName: module.name,
      parts: [
        { partType: 'side', material: 'PAL', length: module.height, width: module.depth, thickness: 18, edgeBanding: 'front' },
        { partType: 'side', material: 'PAL', length: module.height, width: module.depth, thickness: 18, edgeBanding: 'front' },
        { partType: 'top', material: 'PAL', length: module.width, width: module.depth, thickness: 18, edgeBanding: 'left,right,front' },
        { partType: 'bottom', material: 'PAL', length: module.width, width: module.depth, thickness: 18, edgeBanding: 'left,right,front' },
        { partType: 'shelf', material: 'PAL', length: module.width - 36, width: module.depth - 36, thickness: 18, edgeBanding: 'front' }, // Subtracted thickness of sides
        { partType: 'backpanel', material: 'PFL', length: module.width - 4, width: module.height - 4, thickness: 3, edgeBanding: 'none' },
        // Fronts would be added based on module configuration
      ]
    }));
    
    return Promise.resolve({
      projectId: project.id,
      clientName: 'Client Name', // Would come from user data
      dateGenerated: new Date().toISOString(),
      modules: cuttingList
    });
  },
  
  // Generate SVG visualizations for fronts
  generateSvgFronts: async (project: Project): Promise<string[]> => {
    console.log('Generating SVG visualizations for project fronts:', project.id);
    
    // Mock SVG data URLs
    return Promise.resolve(project.modules.map(module => 
      `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCI+PC9zdmc+`
    ));
  },
  
  // Export order for suppliers
  generateSupplierOrder: async (project: Project, supplierType: string): Promise<Record<string, any>> => {
    console.log(`Generating order for ${supplierType} supplier, project:`, project.id);
    
    // Different supplier order formats based on the supplier type
    switch(supplierType) {
      case 'PAL':
        // Group by material type and thickness
        return Promise.resolve({
          orderType: 'material',
          supplier: 'Egger',
          materials: [
            { type: 'PAL', code: 'W980', name: 'Egger Alb W980', thickness: 18, quantity: 12.5 /* m² */ },
            { type: 'PAL', code: 'H1582', name: 'Egger Fag H1582', thickness: 18, quantity: 8.3 /* m² */ }
          ]
        });
        
      case 'accessories':
        // Group by accessory type
        return Promise.resolve({
          orderType: 'accessory',
          supplier: 'Hafele',
          accessories: [
            { type: 'hinge', code: 'CLIP-TOP-110', quantity: 12 },
            { type: 'slide', code: 'TANDEM-500', quantity: 6 }
          ]
        });
        
      case 'glass':
        // Glass processing orders
        return Promise.resolve({
          orderType: 'glass',
          supplier: 'SticlaExpert',
          glassItems: [
            { type: 'STICLA', thickness: 6, width: 597, height: 720, processing: 'cut,drill,edge' },
            { type: 'STICLA', thickness: 6, width: 597, height: 350, processing: 'cut,sandblast' }
          ]
        });
        
      default:
        return Promise.resolve({
          orderType: 'unknown',
          message: 'Unsupported supplier type'
        });
    }
  }
};
