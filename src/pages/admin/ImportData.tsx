
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { 
  Upload, Download, Check, AlertTriangle, 
  FileUp, FileDown, RefreshCw, Database, Box, 
  Users, FileText, File
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const ImportData = () => {
  const [activeTab, setActiveTab] = useState("import");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const intervalId = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            setTimeout(() => {
              setIsUploading(false);
              toast({
                title: "Upload successful",
                description: `File "${file.name}" has been uploaded`,
              });
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
  };

  const handleTemplateDownload = (templateType: string) => {
    toast({
      title: "Template Downloaded",
      description: `${templateType} template has been downloaded`,
    });
    // In a real app, this would trigger a file download
    console.log(`Downloading ${templateType} template`);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium">Data Import/Export</h1>
            <p className="text-muted-foreground">Import and export data to and from the system</p>
          </div>
        </div>
        
        <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload File</CardTitle>
                  <CardDescription>
                    Upload a CSV, Excel or XML file to import data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 h-[200px] flex flex-col items-center justify-center">
                    {!isUploading ? (
                      <>
                        <FileUp size={40} className="text-gray-400 mb-4" />
                        <p className="text-center text-muted-foreground mb-4">
                          Drag and drop your file here or click to browse
                        </p>
                        <Button>
                          <Upload size={16} className="mr-2" />
                          Select File
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept=".csv,.xlsx,.xml,.json"
                            onChange={handleFileUpload}
                          />
                        </Button>
                      </>
                    ) : (
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Uploading...</span>
                          <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Import Settings</CardTitle>
                  <CardDescription>
                    Configure how your data should be imported
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">Update existing records</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">Skip validation</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">Create backup</span>
                      </label>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <Button className="w-full">
                      <Check size={16} className="mr-2" />
                      Start Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Import History</CardTitle>
                  <CardDescription>
                    Recent data imports
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">File</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Records</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2023-05-12</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">materials_bulk.csv</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Materials</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">245</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2023-05-08</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">accessories_update.xlsx</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Accessories</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">128</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2023-05-03</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">users_import.csv</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Users</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">42</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                            Warning (3 failed)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>
                    Select data to export from the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <Database size={20} className="text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">Materials</p>
                          <p className="text-sm text-muted-foreground">Export all materials data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileDown size={16} className="mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <Box size={20} className="text-indigo-500 mr-3" />
                        <div>
                          <p className="font-medium">Accessories</p>
                          <p className="text-sm text-muted-foreground">Export all accessories data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileDown size={16} className="mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <Users size={20} className="text-green-500 mr-3" />
                        <div>
                          <p className="font-medium">Users</p>
                          <p className="text-sm text-muted-foreground">Export all users data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileDown size={16} className="mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <FileText size={20} className="text-amber-500 mr-3" />
                        <div>
                          <p className="font-medium">Projects</p>
                          <p className="text-sm text-muted-foreground">Export all projects data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileDown size={16} className="mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Export Settings</CardTitle>
                  <CardDescription>
                    Configure how your data should be exported
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Format</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel (XLSX)</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">Include headers</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">Compress output</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Export History</CardTitle>
                  <CardDescription>Recent data exports</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Format</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2023-05-15</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">All Materials</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Excel</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2.4 MB</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">
                            <Download size={16} />
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2023-05-10</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Active Users</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">CSV</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">156 KB</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">
                            <Download size={16} />
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2023-05-02</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Project Reports</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">JSON</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">3.1 MB</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="sm">
                            <Download size={16} />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Materials Template</CardTitle>
                  <CardDescription>
                    Import template for materials data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                    <File size={48} className="text-gray-300" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => handleTemplateDownload('Materials')}
                  >
                    <Download size={16} className="mr-2" />
                    Download Template
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Accessories Template</CardTitle>
                  <CardDescription>
                    Import template for accessories data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                    <File size={48} className="text-gray-300" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => handleTemplateDownload('Accessories')}
                  >
                    <Download size={16} className="mr-2" />
                    Download Template
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Users Template</CardTitle>
                  <CardDescription>
                    Import template for user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                    <File size={48} className="text-gray-300" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => handleTemplateDownload('Users')}
                  >
                    <Download size={16} className="mr-2" />
                    Download Template
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Projects Template</CardTitle>
                  <CardDescription>
                    Import template for project data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                    <File size={48} className="text-gray-300" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => handleTemplateDownload('Projects')}
                  >
                    <Download size={16} className="mr-2" />
                    Download Template
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Modules Template</CardTitle>
                  <CardDescription>
                    Import template for furniture modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                    <File size={48} className="text-gray-300" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => handleTemplateDownload('Modules')}
                  >
                    <Download size={16} className="mr-2" />
                    Download Template
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Processing Template</CardTitle>
                  <CardDescription>
                    Import template for processing rules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                    <File size={48} className="text-gray-300" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => handleTemplateDownload('Processing')}
                  >
                    <Download size={16} className="mr-2" />
                    Download Template
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ImportData;
