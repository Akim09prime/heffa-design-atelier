
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ImportHistory {
  id: string;
  type: 'materials' | 'accessories' | 'clients' | 'projects' | 'other';
  filename: string;
  date: Date;
  status: 'success' | 'error' | 'processing';
  records: number;
  errors?: number;
}

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  description: string;
}

const ImportData = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('import');
  const [selectedDataType, setSelectedDataType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
    records?: number;
    errors?: number;
  } | null>(null);
  
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([
    {
      id: '1',
      type: 'materials',
      filename: 'materials_batch_may2025.xlsx',
      date: new Date('2025-05-10T14:30:00'),
      status: 'success',
      records: 156,
      errors: 0,
    },
    {
      id: '2',
      type: 'accessories',
      filename: 'accessories_hafele_q2.csv',
      date: new Date('2025-05-08T09:15:00'),
      status: 'success',
      records: 78,
      errors: 3,
    },
    {
      id: '3',
      type: 'clients',
      filename: 'new_clients_2025.xlsx',
      date: new Date('2025-05-05T11:20:00'),
      status: 'error',
      records: 45,
      errors: 12,
    },
    {
      id: '4',
      type: 'projects',
      filename: 'projects_archive.xlsx',
      date: new Date('2025-05-01T16:40:00'),
      status: 'success',
      records: 24,
      errors: 0,
    },
    {
      id: '5',
      type: 'materials',
      filename: 'egger_materials_update.csv',
      date: new Date('2025-04-28T10:05:00'),
      status: 'success',
      records: 92,
      errors: 5,
    },
  ]);
  
  const templates: TemplateItem[] = [
    {
      id: '1',
      name: 'Materials Template',
      type: 'materials',
      description: 'Template for importing material data including codes, types, dimensions, and pricing',
    },
    {
      id: '2',
      name: 'Accessories Template',
      type: 'accessories',
      description: 'Template for importing accessories with specifications, compatibility, and pricing',
    },
    {
      id: '3',
      name: 'Clients Template',
      type: 'clients',
      description: 'Template for importing client data and project history',
    },
    {
      id: '4',
      name: 'Projects Template',
      type: 'projects',
      description: 'Template for importing project specifications and configurations',
    },
    {
      id: '5',
      name: 'Processing Rules Template',
      type: 'processing',
      description: 'Template for importing material processing rules and configurations',
    },
  ];
  
  const handleFileImport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!selectedDataType) {
      toast({
        title: 'Data Type Required',
        description: 'Please select a data type before uploading.',
        variant: 'destructive',
      });
      return;
    }
    
    const fileInput = event.currentTarget.elements.namedItem('file') as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (!file) {
      toast({
        title: 'File Required',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }
    
    // Simulate file upload and processing
    setIsProcessing(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate processing completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsProcessing(false);
      
      // Generate random success/error for demo
      const isSuccess = Math.random() > 0.3;
      const recordCount = Math.floor(Math.random() * 100) + 20;
      const errorCount = isSuccess ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 15) + 10;
      
      // Record import history
      const newImport: ImportHistory = {
        id: `import-${Date.now()}`,
        type: selectedDataType as any,
        filename: file.name,
        date: new Date(),
        status: isSuccess ? 'success' : 'error',
        records: recordCount,
        errors: errorCount,
      };
      
      setImportHistory(prev => [newImport, ...prev]);
      
      // Set result for dialog
      setImportResult({
        success: isSuccess,
        message: isSuccess 
          ? `Successfully imported ${recordCount} records with ${errorCount} errors` 
          : `Import failed with ${errorCount} errors`,
        details: isSuccess 
          ? 'All records have been processed. Some records may have warnings or minor issues.' 
          : 'Please check the error report for details on failed imports.',
        records: recordCount,
        errors: errorCount,
      });
      
      setShowResultDialog(true);
      
      // Reset form
      fileInput.value = '';
      setSelectedDataType('');
      
    }, 3000);
  };
  
  const handleDownloadTemplate = (templateType: string) => {
    toast({
      title: 'Template Downloaded',
      description: `The ${templateType} template has been downloaded.`,
    });
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Data Import/Export</h1>
            <p className="text-gray-300">Import and export data to and from the system</p>
          </div>
        </div>

        <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Import History</TabsTrigger>
          </TabsList>
          
          {/* Import Data Tab */}
          <TabsContent value="import">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Import Data</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload files to import data into the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileImport} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="data-type">Data Type</Label>
                      <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                        <SelectTrigger id="data-type" className="bg-gray-700 border-gray-600 mt-1.5">
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="materials">Materials</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="projects">Projects</SelectItem>
                          <SelectItem value="processing">Processing Rules</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="file">Upload File</Label>
                      <div className="mt-1.5">
                        <Input 
                          id="file" 
                          name="file"
                          type="file" 
                          className="bg-gray-700 border-gray-600" 
                          accept=".csv,.xlsx,.xls"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Accepted formats: .xlsx, .xls, .csv
                        </p>
                      </div>
                    </div>
                    
                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Processing...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isProcessing}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t border-gray-700 bg-gray-800/50">
                <div className="text-sm text-gray-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>For large imports, the process may take several minutes to complete.</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Export Data Tab */}
          <TabsContent value="export">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Export Data</CardTitle>
                <CardDescription className="text-gray-400">
                  Export system data in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="export-type">Data Type</Label>
                      <Select defaultValue="materials">
                        <SelectTrigger id="export-type" className="bg-gray-700 border-gray-600 mt-1.5">
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="materials">Materials</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="projects">Projects</SelectItem>
                          <SelectItem value="processing">Processing Rules</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="export-format">Format</Label>
                      <Select defaultValue="xlsx">
                        <SelectTrigger id="export-format" className="bg-gray-700 border-gray-600 mt-1.5">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                          <SelectItem value="csv">CSV (.csv)</SelectItem>
                          <SelectItem value="json">JSON (.json)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="include-inactive"
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600"
                      />
                      <Label htmlFor="include-inactive">Include inactive items</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => {
                      toast({
                        title: "Export Started",
                        description: "Your data export has been initiated.",
                      });
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Data Templates</CardTitle>
                <CardDescription className="text-gray-400">
                  Download templates for data import
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FileSpreadsheet className="h-10 w-10 text-blue-400" />
                          <div>
                            <h3 className="font-medium text-white">{template.name}</h3>
                            <p className="text-sm text-gray-400">{template.description}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => handleDownloadTemplate(template.type)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Import History Tab */}
          <TabsContent value="history">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Import History</CardTitle>
                <CardDescription className="text-gray-400">
                  View past data imports and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {importHistory.map((item) => (
                    <Card key={item.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.status)}
                            <div>
                              <h3 className="font-medium text-white">{item.filename}</h3>
                              <p className="text-sm text-gray-400">
                                {formatDate(item.date)} • {item.records} records
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                item.status === 'success' 
                                  ? 'bg-green-900/30 text-green-400' 
                                  : item.status === 'error'
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-yellow-900/30 text-yellow-400'
                              }
                            >
                              {item.status === 'success' 
                                ? `Success (${item.errors} errors)` 
                                : item.status === 'error'
                                ? `Failed (${item.errors} errors)`
                                : 'Processing'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Import Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {importResult?.success ? 'Import Complete' : 'Import Failed'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4">
              {importResult?.success 
                ? <CheckCircle className="h-10 w-10 text-green-500" />
                : <XCircle className="h-10 w-10 text-red-500" />
              }
              <div>
                <p className="text-lg font-medium">{importResult?.message}</p>
                <p className="text-gray-400">{importResult?.details}</p>
              </div>
            </div>
            
            {importResult?.success && (
              <div className="bg-gray-700 border border-gray-600 rounded-md p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-400">Records Processed</p>
                    <p className="text-xl font-medium">{importResult.records}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Errors/Warnings</p>
                    <p className="text-xl font-medium">{importResult.errors}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {importResult?.success ? (
              <>
                <Button variant="outline" onClick={() => setShowResultDialog(false)}>
                  Close
                </Button>
                {(importResult.errors ?? 0) > 0 && (
                  <Button onClick={() => {
                    toast({
                      title: "Error Report Downloaded",
                      description: "The error report has been downloaded to your computer.",
                    });
                  }}>
                    Download Error Report
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowResultDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Error Report Downloaded",
                    description: "The error report has been downloaded to your computer.",
                  });
                }}>
                  Download Error Report
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ImportData;
