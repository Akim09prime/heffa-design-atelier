
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Upload, Check, FileText, FileCode, Database } from 'lucide-react';
import { ProjectService } from '@/services/projectService';
import { ProjectType } from '@/types';

const ImportProject = () => {
  const [fileType, setFileType] = useState('heffa');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload and processing
    const interval = setInterval(() => {
      setUploadProgress(progress => {
        const newProgress = progress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          setTimeout(() => {
            setIsUploading(false);
            toast({
              title: "Import successful",
              description: "Your design has been imported successfully",
            });
            
            // Create a new project from the import (in a real app, this would parse the file)
            const newProject = {
              userId: '1',
              name: selectedFile.name.replace(/\.[^/.]+$/, ""),
              description: `Imported from ${fileType.toUpperCase()} file`,
              type: 'Free Mode' as ProjectType,
              roomType: 'other',
              status: 'imported',
              modules: [],
              dimensions: {
                width: 3000,
                length: 3000,
                height: 2400,
                walls: []
              },
              // Add the missing parameters property
              parameters: {
                importSource: fileType,
                importedFileName: selectedFile.name,
                importDate: new Date().toISOString()
              }
            };
            
            ProjectService.createProject(newProject)
              .then(createdProject => {
                navigate(`/designer/projects/${createdProject.id}/3d-editor`);
              })
              .catch(error => {
                console.error("Error creating project:", error);
                toast({
                  title: "Error",
                  description: "Failed to create project from import",
                  variant: "destructive",
                });
              });
              
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  const handleCancel = () => {
    navigate('/designer/projects');
  };

  const getFileTypeName = (type: string) => {
    switch (type) {
      case 'heffa': return 'HeffaDesign (.hfa)';
      case 'sketchup': return 'SketchUp (.skp)';
      case 'fusion360': return 'Fusion 360 (.f3d)';
      case 'autocad': return 'AutoCAD (.dwg)';
      case 'rhino': return 'Rhino (.3dm)';
      default: return 'Unknown format';
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-medium">Import Design</h1>
            <p className="text-muted-foreground">Import designs from other software</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Import Format</CardTitle>
                <CardDescription>
                  Choose the format of the design file you want to import
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="heffa" value={fileType} onValueChange={setFileType}>
                  <TabsList className="grid grid-cols-3 lg:grid-cols-5 w-full">
                    <TabsTrigger value="heffa">HeffaDesign</TabsTrigger>
                    <TabsTrigger value="sketchup">SketchUp</TabsTrigger>
                    <TabsTrigger value="fusion360">Fusion 360</TabsTrigger>
                    <TabsTrigger value="autocad">AutoCAD</TabsTrigger>
                    <TabsTrigger value="rhino">Rhino</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={fileType} className="mt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {fileType === 'heffa' ? (
                          'Import a design created with HeffaDesign. This will preserve all materials, dimensions, and modules.'
                        ) : fileType === 'sketchup' ? (
                          'Import a SketchUp (.skp) file. Components will be converted to modules when possible.'
                        ) : fileType === 'fusion360' ? (
                          'Import a Fusion 360 design. Components and materials will be mapped to HeffaDesign elements.'
                        ) : fileType === 'autocad' ? (
                          'Import AutoCAD drawings. 2D drawings will be extruded to create 3D furniture elements.'
                        ) : (
                          'Import a Rhino 3D model. NURBS surfaces will be converted to compatible geometry.'
                        )}
                      </p>
                      
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 h-[200px] flex flex-col items-center justify-center">
                        {!isUploading ? (
                          <>
                            <FileUp size={40} className="text-gray-400 mb-4" />
                            <p className="text-center text-muted-foreground mb-4">
                              {selectedFile ? `Selected: ${selectedFile.name}` : `Drag and drop your ${getFileTypeName(fileType)} file here or click to browse`}
                            </p>
                            <Button>
                              <Upload size={16} className="mr-2" />
                              Select File
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept={fileType === 'heffa' ? '.hfa' : 
                                        fileType === 'sketchup' ? '.skp' :
                                        fileType === 'fusion360' ? '.f3d' :
                                        fileType === 'autocad' ? '.dwg' :
                                        '.3dm'}
                                onChange={handleFileUpload}
                              />
                            </Button>
                          </>
                        ) : (
                          <div className="w-full space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Processing {selectedFile?.name}...</span>
                              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground text-center">
                              {uploadProgress < 30 ? "Reading file contents..." : 
                               uploadProgress < 60 ? "Converting geometry..." : 
                               uploadProgress < 90 ? "Mapping materials..." : 
                               "Finalizing import..."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button 
                  onClick={handleImport}
                  disabled={!selectedFile || isUploading}
                >
                  <Check size={16} className="mr-2" />
                  Import Design
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Import Information</CardTitle>
                <CardDescription>
                  Things to know about importing designs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <FileCode size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Supported Formats</h3>
                      <p className="text-xs text-muted-foreground">
                        We support .hfa, .skp, .f3d, .dwg, and .3dm file formats.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-amber-100">
                      <FileText size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Material Mapping</h3>
                      <p className="text-xs text-muted-foreground">
                        Materials from imported files will be automatically mapped to our material database.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <Database size={16} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Design Conversion</h3>
                      <p className="text-xs text-muted-foreground">
                        Complex geometry may be simplified during import to ensure compatibility.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DesignerLayout>
  );
};

export default ImportProject;
