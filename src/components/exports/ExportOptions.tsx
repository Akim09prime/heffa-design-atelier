
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, FileText, Table, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ExportService } from '@/services/exportService';

interface ExportOptionsProps {
  project: Project | null;
  onClose: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ project, onClose }) => {
  const [exportType, setExportType] = useState<'pdf' | 'excel' | 'dxf'>('pdf');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // PDF export options
  const [includeRenderingsPdf, setIncludeRenderingsPdf] = useState(true);
  const [includeMaterialsPdf, setIncludeMaterialsPdf] = useState(true);
  const [includeAssemblyPdf, setIncludeAssemblyPdf] = useState(true);
  const [includePricesPdf, setIncludePricesPdf] = useState(true);
  const [pdfFormat, setPdfFormat] = useState('A4');
  const [pdfOrientation, setPdfOrientation] = useState('portrait');

  // Excel export options
  const [includeMaterialsExcel, setIncludeMaterialsExcel] = useState(true);
  const [includeAccessoriesExcel, setIncludeAccessoriesExcel] = useState(true);
  const [includeProcessingExcel, setIncludeProcessingExcel] = useState(true);
  const [includePricesExcel, setIncludePricesExcel] = useState(true);
  const [excelFormat, setExcelFormat] = useState('detailed');

  // DXF export options
  const [dxfScale, setDxfScale] = useState('1:1');
  const [dxfLayers, setDxfLayers] = useState('separate');
  const [dxfParts, setDxfParts] = useState<string[]>(['top', 'sides', 'bottom', 'shelves', 'doors', 'drawers']);

  // Handle checkbox change for DXF parts
  const handleDxfPartChange = (part: string) => {
    if (dxfParts.includes(part)) {
      setDxfParts(dxfParts.filter(p => p !== part));
    } else {
      setDxfParts([...dxfParts, part]);
    }
  };

  // Generate export filename
  const getExportFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    const projectName = project?.name || 'project';
    const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    return `${sanitizedName}_${date}`;
  };

  // Handle export
  const handleExport = async () => {
    if (!project) {
      toast({
        title: "Error",
        description: "No project data available for export",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create export options based on selected export type
      const options = {
        filename: getExportFilename(),
        format: exportType,
        project,
        settings: {} as any,
      };

      // Add settings based on export type
      switch (exportType) {
        case 'pdf':
          options.settings = {
            includeRenderings: includeRenderingsPdf,
            includeMaterials: includeMaterialsPdf,
            includeAssembly: includeAssemblyPdf,
            includePrices: includePricesPdf,
            format: pdfFormat,
            orientation: pdfOrientation,
          };
          break;

        case 'excel':
          options.settings = {
            includeMaterials: includeMaterialsExcel,
            includeAccessories: includeAccessoriesExcel,
            includeProcessing: includeProcessingExcel,
            includePrices: includePricesExcel,
            format: excelFormat,
          };
          break;

        case 'dxf':
          options.settings = {
            scale: dxfScale,
            layers: dxfLayers,
            parts: dxfParts,
          };
          break;
      }

      // Call export service
      const result = await ExportService.exportProject(options);

      toast({
        title: "Export Completed",
        description: `${exportType.toUpperCase()} export has been generated and downloaded`,
      });

      // Optional: trigger download programmatically
      if (result?.downloadUrl) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${options.filename}.${exportType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while generating the export",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Export Project</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Export your project in various formats for manufacturing and presentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="pdf" 
          onValueChange={(value) => setExportType(value as 'pdf' | 'excel' | 'dxf')}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF Document
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Excel Spreadsheet
            </TabsTrigger>
            <TabsTrigger value="dxf" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M17 21h-10a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 17l3-3m0 0l3 3m-3-3v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              DXF Drawing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pdf" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Content Options</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="renderings-pdf" 
                      checked={includeRenderingsPdf}
                      onCheckedChange={() => setIncludeRenderingsPdf(!includeRenderingsPdf)}
                    />
                    <Label htmlFor="renderings-pdf">Include 3D Renderings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="materials-pdf" 
                      checked={includeMaterialsPdf}
                      onCheckedChange={() => setIncludeMaterialsPdf(!includeMaterialsPdf)}
                    />
                    <Label htmlFor="materials-pdf">Include Materials List</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="assembly-pdf" 
                      checked={includeAssemblyPdf}
                      onCheckedChange={() => setIncludeAssemblyPdf(!includeAssemblyPdf)}
                    />
                    <Label htmlFor="assembly-pdf">Include Assembly Instructions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prices-pdf" 
                      checked={includePricesPdf}
                      onCheckedChange={() => setIncludePricesPdf(!includePricesPdf)}
                    />
                    <Label htmlFor="prices-pdf">Include Price Breakdown</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Format Options</Label>
                <div className="mt-2 space-y-4">
                  <div>
                    <Label htmlFor="pdf-format" className="text-sm">Paper Size</Label>
                    <Select value={pdfFormat} onValueChange={setPdfFormat}>
                      <SelectTrigger id="pdf-format" className="mt-1">
                        <SelectValue placeholder="Select paper size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Orientation</Label>
                    <RadioGroup 
                      value={pdfOrientation} 
                      onValueChange={setPdfOrientation}
                      className="flex gap-4 mt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="portrait" id="portrait" />
                        <Label htmlFor="portrait">Portrait</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landscape" id="landscape" />
                        <Label htmlFor="landscape">Landscape</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="excel" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Content Options</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="materials-excel" 
                      checked={includeMaterialsExcel}
                      onCheckedChange={() => setIncludeMaterialsExcel(!includeMaterialsExcel)}
                    />
                    <Label htmlFor="materials-excel">Include Materials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="accessories-excel" 
                      checked={includeAccessoriesExcel}
                      onCheckedChange={() => setIncludeAccessoriesExcel(!includeAccessoriesExcel)}
                    />
                    <Label htmlFor="accessories-excel">Include Accessories</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="processing-excel" 
                      checked={includeProcessingExcel}
                      onCheckedChange={() => setIncludeProcessingExcel(!includeProcessingExcel)}
                    />
                    <Label htmlFor="processing-excel">Include Processing Steps</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prices-excel" 
                      checked={includePricesExcel}
                      onCheckedChange={() => setIncludePricesExcel(!includePricesExcel)}
                    />
                    <Label htmlFor="prices-excel">Include Price Information</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Format Options</Label>
                <div className="mt-2 space-y-4">
                  <div>
                    <Label htmlFor="excel-format" className="text-sm">Sheet Format</Label>
                    <Select value={excelFormat} onValueChange={setExcelFormat}>
                      <SelectTrigger id="excel-format" className="mt-1">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="simplified">Simplified</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="client">Client-Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dxf" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Drawing Parts</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="top-dxf" 
                      checked={dxfParts.includes('top')}
                      onCheckedChange={() => handleDxfPartChange('top')}
                    />
                    <Label htmlFor="top-dxf">Top Panel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sides-dxf" 
                      checked={dxfParts.includes('sides')}
                      onCheckedChange={() => handleDxfPartChange('sides')}
                    />
                    <Label htmlFor="sides-dxf">Side Panels</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bottom-dxf" 
                      checked={dxfParts.includes('bottom')}
                      onCheckedChange={() => handleDxfPartChange('bottom')}
                    />
                    <Label htmlFor="bottom-dxf">Bottom Panel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shelves-dxf" 
                      checked={dxfParts.includes('shelves')}
                      onCheckedChange={() => handleDxfPartChange('shelves')}
                    />
                    <Label htmlFor="shelves-dxf">Shelves</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="doors-dxf" 
                      checked={dxfParts.includes('doors')}
                      onCheckedChange={() => handleDxfPartChange('doors')}
                    />
                    <Label htmlFor="doors-dxf">Doors</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="drawers-dxf" 
                      checked={dxfParts.includes('drawers')}
                      onCheckedChange={() => handleDxfPartChange('drawers')}
                    />
                    <Label htmlFor="drawers-dxf">Drawers</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Drawing Options</Label>
                <div className="mt-2 space-y-4">
                  <div>
                    <Label htmlFor="dxf-scale" className="text-sm">Scale</Label>
                    <Select value={dxfScale} onValueChange={setDxfScale}>
                      <SelectTrigger id="dxf-scale" className="mt-1">
                        <SelectValue placeholder="Select scale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1 (Full Scale)</SelectItem>
                        <SelectItem value="1:2">1:2</SelectItem>
                        <SelectItem value="1:5">1:5</SelectItem>
                        <SelectItem value="1:10">1:10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dxf-layers" className="text-sm">Layer Organization</Label>
                    <Select value={dxfLayers} onValueChange={setDxfLayers}>
                      <SelectTrigger id="dxf-layers" className="mt-1">
                        <SelectValue placeholder="Select layer organization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="separate">Separate Layers by Part Type</SelectItem>
                        <SelectItem value="material">Separate Layers by Material</SelectItem>
                        <SelectItem value="module">Separate Layers by Module</SelectItem>
                        <SelectItem value="combined">Combined (Single Layer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleExport} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? 'Processing...' : (
              <>
                <Download className="h-4 w-4" />
                Export {exportType.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
