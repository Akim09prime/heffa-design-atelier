
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Table, FileCode, Package, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types';
import { ExportService } from '@/services/exportService';

interface ExportOptionsProps {
  project: Project;
  onClose?: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ project, onClose }) => {
  const [exportType, setExportType] = useState<'pdf' | 'excel' | 'dxf' | 'svg' | 'all'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [includeOptions, setIncludeOptions] = useState({
    details: true,
    images: true,
    accessories: true,
    cutting: true
  });
  const { toast } = useToast();

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let exportResult;
      
      switch (exportType) {
        case 'pdf':
          exportResult = await ExportService.generatePdfOffer(project, {
            includeDetails: includeOptions.details,
            includeImages: includeOptions.images,
            includeAccessories: includeOptions.accessories
          });
          toast({
            title: 'PDF Generated',
            description: 'Your project has been exported as PDF'
          });
          // Trigger download
          window.open(exportResult, '_blank');
          break;
          
        case 'excel':
          exportResult = await ExportService.generateExcelCuttingSheet(project, {
            includeCutting: includeOptions.cutting
          });
          toast({
            title: 'Excel Generated',
            description: 'Cutting sheet has been exported as Excel'
          });
          window.open(exportResult, '_blank');
          break;
          
        case 'dxf':
          exportResult = await ExportService.generateDxfFiles(project);
          toast({
            title: 'DXF Files Generated',
            description: `${exportResult.length} DXF files have been generated`
          });
          exportResult.forEach((url, index) => {
            setTimeout(() => window.open(url, '_blank'), index * 100);
          });
          break;
          
        case 'all':
          const zipBundle = await ExportService.generateZipBundle(project);
          toast({
            title: 'Export Bundle Generated',
            description: 'All export files have been bundled into a ZIP archive'
          });
          window.open(zipBundle, '_blank');
          break;
          
        default:
          toast({
            title: 'Export Error',
            description: 'Invalid export type selected',
            variant: 'destructive'
          });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate export files',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle email export
  const handleEmailExport = async () => {
    if (!recipientEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter a recipient email address',
        variant: 'destructive'
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      const exportTypes = [exportType === 'all' ? 'pdf' : exportType] as ('pdf' | 'excel' | 'dxf' | 'svg' | 'json')[];
      
      const result = await ExportService.emailExports(project, recipientEmail, exportTypes, message);
      
      if (result) {
        toast({
          title: 'Email Sent',
          description: `Export files have been sent to ${recipientEmail}`
        });
        setRecipientEmail('');
        setMessage('');
      } else {
        toast({
          title: 'Email Failed',
          description: 'Failed to send export files',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Email error:', error);
      toast({
        title: 'Email Failed',
        description: 'Failed to send export files',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Export Project</CardTitle>
        <CardDescription>
          Export your project in various formats for manufacturing and sharing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="download" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="download">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant={exportType === 'pdf' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => setExportType('pdf')}
                >
                  <FileText className="h-8 w-8" />
                  <span>PDF Offer</span>
                </Button>
                
                <Button
                  variant={exportType === 'excel' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => setExportType('excel')}
                >
                  <Table className="h-8 w-8" />
                  <span>Excel Cutting List</span>
                </Button>
                
                <Button
                  variant={exportType === 'dxf' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => setExportType('dxf')}
                >
                  <FileCode className="h-8 w-8" />
                  <span>DXF Files</span>
                </Button>
                
                <Button
                  variant={exportType === 'all' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => setExportType('all')}
                >
                  <Package className="h-8 w-8" />
                  <span>All Formats (ZIP)</span>
                </Button>
              </div>
              
              <div className="border rounded-md p-4 space-y-3">
                <h3 className="text-sm font-medium">Include in export:</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-details" 
                      checked={includeOptions.details}
                      onCheckedChange={(checked) => 
                        setIncludeOptions({...includeOptions, details: checked === true})
                      }
                    />
                    <Label htmlFor="include-details">Project Details</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-images" 
                      checked={includeOptions.images}
                      onCheckedChange={(checked) => 
                        setIncludeOptions({...includeOptions, images: checked === true})
                      }
                    />
                    <Label htmlFor="include-images">Images & Renders</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-accessories" 
                      checked={includeOptions.accessories}
                      onCheckedChange={(checked) => 
                        setIncludeOptions({...includeOptions, accessories: checked === true})
                      }
                    />
                    <Label htmlFor="include-accessories">Accessories List</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-cutting" 
                      checked={includeOptions.cutting}
                      onCheckedChange={(checked) => 
                        setIncludeOptions({...includeOptions, cutting: checked === true})
                      }
                    />
                    <Label htmlFor="include-cutting">Cutting Details</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Recipient Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="client@example.com" 
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="Here's the project export you requested..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant={exportType === 'pdf' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-16 gap-1"
                  onClick={() => setExportType('pdf')}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">PDF Offer</span>
                </Button>
                
                <Button
                  variant={exportType === 'excel' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-16 gap-1"
                  onClick={() => setExportType('excel')}
                >
                  <Table className="h-4 w-4" />
                  <span className="text-xs">Excel Cutting List</span>
                </Button>
                
                <Button
                  variant={exportType === 'dxf' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-16 gap-1"
                  onClick={() => setExportType('dxf')}
                >
                  <FileCode className="h-4 w-4" />
                  <span className="text-xs">DXF Files</span>
                </Button>
                
                <Button
                  variant={exportType === 'all' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center h-16 gap-1"
                  onClick={() => setExportType('all')}
                >
                  <Package className="h-4 w-4" />
                  <span className="text-xs">All Formats</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        
        <Tabs.Current>
          {(currentTab) => (
            currentTab === "download" ? (
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
              >
                {isExporting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export {exportType.toUpperCase()}
                  </span>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleEmailExport} 
                disabled={isExporting || !recipientEmail}
              >
                {isExporting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Email
                  </span>
                )}
              </Button>
            )
          )}
        </Tabs.Current>
      </CardFooter>
    </Card>
  );
};
