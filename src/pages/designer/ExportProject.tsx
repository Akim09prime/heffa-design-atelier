
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ExportForm } from '@/components/exports/ExportForm';
import { SupplierOrderForm } from '@/components/exports/SupplierOrderForm';
import { CuttingListView } from '@/components/exports/CuttingListView';
import { Project } from '@/types';
import { projectService } from '@/services/projectService';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExportProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          const fetchedProject = await projectService.getProjectById(projectId);
          setProject(fetchedProject);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  if (loading) {
    return (
      <DesignerLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <p>Loading project data...</p>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  if (!project) {
    return (
      <DesignerLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <p>Project not found</p>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/designer/exports')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Export Project: {project.name}</h1>
          </div>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-6">
            <TabsTrigger value="export">Export Options</TabsTrigger>
            <TabsTrigger value="cutting">Cutting List</TabsTrigger>
            <TabsTrigger value="supplier">Supplier Orders</TabsTrigger>
            <TabsTrigger value="preview">Project Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export">
            <ExportForm project={project} />
          </TabsContent>
          
          <TabsContent value="cutting">
            <CuttingListView project={project} />
          </TabsContent>
          
          <TabsContent value="supplier">
            <SupplierOrderForm project={project} />
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-1/2 h-96">
                    <SceneContainer 
                      modules={project.modules} 
                      roomWidth={project.dimensions.width}
                      roomLength={project.dimensions.length}
                      roomHeight={project.dimensions.height}
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <h3 className="text-xl font-medium mb-4">Project Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Project Name</p>
                        <p className="font-medium">{project.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p>{project.description || 'No description provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Room Type</p>
                        <p className="font-medium capitalize">{project.roomType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dimensions</p>
                        <p>
                          {project.dimensions.width}m × {project.dimensions.length}m × {project.dimensions.height}m
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Modules</p>
                        <p>{project.modules.length} modules</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default ExportProject;
