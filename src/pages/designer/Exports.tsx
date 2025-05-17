
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  FileSpreadsheet, 
  FileX, 
  Download, 
  Mail, 
  FileDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ExportFormat } from '@/types';

const Exports = () => {
  const { toast } = useToast();
  const [exportType, setExportType] = useState<ExportFormat>('pdf');
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedProject, setSelectedProject] = useState('kitchen-project-2023');
  
  // Mock projects for the demo
  const projects = [
    { id: 'kitchen-project-2023', name: 'Kitchen Remodel 2023' },
    { id: 'office-furniture-set', name: 'Office Furniture Set' },
    { id: 'bedroom-wardrobe', name: 'Master Bedroom Wardrobe' },
  ];

  const exportConfig = {
    includeDetails: true,
    includeImages: true,
    includeAccessories: true,
    includeCutting: true
  };

  const handleExport = async (format: ExportFormat, action: 'download' | 'email') => {
    setLoading({ ...loading, [format]: true });
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading({ ...loading, [format]: false });
    
    if (action === 'download') {
      toast({
        title: "Export successful",
        description: `${format.toUpperCase()} file has been generated and downloaded.`,
      });
    } else {
      toast({
        title: "Export emailed",
        description: `${format.toUpperCase()} file has been sent to client and suppliers.`,
      });
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium mb-6">Export Options</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project selection */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Project Selection</CardTitle>
              <CardDescription>
                Select the project you want to export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="secondary">
                  Refresh Projects
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Export options */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="document">Documents</TabsTrigger>
                <TabsTrigger value="cutting">Cutting Lists</TabsTrigger>
                <TabsTrigger value="cnc">CNC Files</TabsTrigger>
                <TabsTrigger value="supplier">Supplier Orders</TabsTrigger>
              </TabsList>
              
              {/* Documents Tab */}
              <TabsContent value="document">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Exports</CardTitle>
                    <CardDescription>
                      Generate client-facing documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <FileText className="mr-2 h-5 w-5" />
                            Client Offer (PDF)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          Complete offer with pricing, materials, and rendered images
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExport('pdf', 'email')}
                            disabled={loading['pdf']}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            {loading['pdf'] ? 'Sending...' : 'Email to client'}
                          </Button>
                          <Button 
                            onClick={() => handleExport('pdf', 'download')}
                            size="sm"
                            disabled={loading['pdf']}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {loading['pdf'] ? 'Processing...' : 'Download'}
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <FileDown className="mr-2 h-5 w-5" />
                            Project JSON
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          Export complete project data in JSON format for backup or transfer
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2">
                          <Button 
                            onClick={() => handleExport('json', 'download')}
                            size="sm"
                            disabled={loading['json']}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {loading['json'] ? 'Processing...' : 'Download'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Cutting Lists Tab */}
              <TabsContent value="cutting">
                <Card>
                  <CardHeader>
                    <CardTitle>Cutting Lists</CardTitle>
                    <CardDescription>
                      Generate material cutting lists for production
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <FileSpreadsheet className="mr-2 h-5 w-5" />
                          Excel Cutting List
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Detailed spreadsheet with all panels, dimensions, and edgebanding
                      </CardContent>
                      <CardFooter className="flex justify-end pt-2">
                        <Button 
                          onClick={() => handleExport('excel', 'download')}
                          size="sm"
                          disabled={loading['excel']}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {loading['excel'] ? 'Processing...' : 'Download Excel'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* CNC Files Tab */}
              <TabsContent value="cnc">
                <Card>
                  <CardHeader>
                    <CardTitle>CNC Export Files</CardTitle>
                    <CardDescription>
                      Generate CNC-compatible files for automated cutting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <FileX className="mr-2 h-5 w-5" />
                            DXF Files
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          Industry-standard DXF format for CNC machines
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2">
                          <Button 
                            onClick={() => handleExport('dxf', 'download')}
                            size="sm"
                            disabled={loading['dxf']}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {loading['dxf'] ? 'Processing...' : 'Download DXF'}
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <FileX className="mr-2 h-5 w-5" />
                            SVG Files
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          SVG format for modern CNC software and visualization
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2">
                          <Button 
                            onClick={() => handleExport('svg', 'download')}
                            size="sm"
                            disabled={loading['svg']}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {loading['svg'] ? 'Processing...' : 'Download SVG'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Supplier Orders Tab */}
              <TabsContent value="supplier">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Order Forms</CardTitle>
                    <CardDescription>
                      Generate order forms for different suppliers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Egger Materials', 'Hafele Accessories', 'Blum Mechanisms'].map((supplier) => (
                        <Card key={supplier}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{supplier}</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            Order form for {supplier.split(' ')[0]} products
                          </CardContent>
                          <CardFooter className="flex justify-between pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExport('pdf', 'email')}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Email to supplier
                            </Button>
                            <Button size="sm" onClick={() => handleExport('pdf', 'download')}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Export configuration panel */}
          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>
                Configure export options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-details" defaultChecked />
                  <Label htmlFor="include-details">Include detailed specifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-images" defaultChecked />
                  <Label htmlFor="include-images">Include rendered images</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-accessories" defaultChecked />
                  <Label htmlFor="include-accessories">Include accessories</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-cutting" defaultChecked />
                  <Label htmlFor="include-cutting">Include cutting diagrams</Label>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Company Details</h4>
                <div className="text-xs text-muted-foreground">
                  <p>HeffaDesign SRL</p>
                  <p>CUI: RO12345678</p>
                  <p>Email: office@heffadesign.com</p>
                  <p>Phone: +40 721 234 567</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Update Company Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DesignerLayout>
  );
};

export default Exports;
