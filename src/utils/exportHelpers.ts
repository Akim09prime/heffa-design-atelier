
import { Project } from '@/types';
import { ExportService, ExportOptions, ExportResult } from '@/services/exportService';

// Project export helper function
export const exportProjectFile = async (
  project: Project,
  exportType: 'pdf' | 'excel' | 'dxf' | 'json',
  settings: Record<string, any>,
  filename?: string
): Promise<ExportResult> => {
  if (!project) {
    return {
      success: false,
      message: "No project data available for export"
    };
  }
  
  // Generate a default filename if not provided
  if (!filename) {
    const date = new Date().toISOString().split('T')[0];
    const projectName = project?.name || 'project';
    const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    filename = `${sanitizedName}_${date}`;
  }
  
  // Prepare export options
  const options: ExportOptions = {
    filename,
    format: exportType,
    project,
    settings
  };
  
  // Call the export service
  try {
    const result = await ExportService.exportProject(options);
    return result;
  } catch (error) {
    console.error('Export failed:', error);
    return {
      success: false,
      message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Helper to trigger file download
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
