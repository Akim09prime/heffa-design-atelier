import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import ProjectTypeSelector from '@/components/projects/ProjectTypeSelector';
import { Project, ProjectType, ProjectSubType } from '@/types';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Printer, ChevronRight, Save, Calculator, FileText, Edit } from 'lucide-react';

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<ProjectSubType | null>(null);
  const [projectParameters, setProjectParameters] = useState<Record<string, any>>({});
  const [projectId, setProjectId] = useState<string | null>(null);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);

  // Create project handler
  const handleCreateProject = async (
    type: ProjectType,
    subType: ProjectSubType | undefined,
    parameters: Record<string, any>
  ) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You need to be logged in to create a project',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Save selected values
      setSelectedType(type);
      setSelectedSubType(subType || null);
      setProjectParameters(parameters);

      // Validate project type configuration
      const validation = ProjectService.validateProjectTypeConfig(type, subType);
      if (!validation.valid) {
        toast({
          title: 'Validation Error',
          description: validation.message,
          variant: 'destructive',
        });
        return;
      }

      // Generate default walls based on project type
      const walls = ProjectService.generateDefaultWalls(type, subType);

      // Create a new project
      const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user?.id || 'guest',
        name: `New ${type} Project`,
        description: `${type}${subType ? ` (${subType})` : ''} project`,
        type,
        subType,
        parameters,
        status: 'draft',
        roomType: type.toLowerCase().includes('kitchen') 
          ? 'kitchen' 
          : type.toLowerCase().includes('bedroom') 
            ? 'bedroom' 
            : type.toLowerCase().includes('bathroom') 
              ? 'bathroom' 
              : type.toLowerCase().includes('living') 
                ? 'livingroom' 
                : 'other',
        modules: [],
        dimensions: {
          width: 4000,
          length: 3000,
          height: 2400,
          walls
        }
      };

      // Call the service to create the project
      const result = await ProjectService.createProject(newProject);
      console.log("Creating new project:", result);
      setProjectId(result.id);
      setCreatedProject(result);

      toast({
        title: 'Project Created',
        description: `${type} project has been created successfully`,
      });

      // Don't navigate immediately - let user choose next step
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
      console.error('Project creation error:', error);
    }
  };

  const handleContinueTo3D = () => {
    if (projectId) {
      console.log(`Navigating to 3D editor for project ${projectId}`);
      navigate(`/designer/projects/${projectId}/3d-editor`);
    } else {
      toast({
        title: 'Error',
        description: 'Project not created yet',
        variant: 'destructive',
      });
    }
  };

  // Modified handler to navigate to the new edit page
  const handleEditProject = () => {
    if (projectId) {
      console.log(`Navigating to edit project ${projectId}`);
      navigate(`/designer/projects/${projectId}/edit`);
    } else {
      toast({
        title: 'Error',
        description: 'Project not created yet',
        variant: 'destructive',
      });
    }
  };
  
  const handleBrowseModules = () => {
    if (projectId) {
      console.log(`Navigating to modules for project ${projectId}`);
      navigate(`/designer/modules`);
    } else {
      toast({
        title: 'Error',
        description: 'Please create a project first before browsing modules',
        variant: 'destructive',
      });
    }
  };
  
  const handleCreateQuote = () => {
    if (projectId) {
      console.log(`Navigating to quote creation for project ${projectId}`);
      navigate(`/designer/projects/${projectId}/quote`);
    } else {
      toast({
        title: 'Error',
        description: 'Please create a project first before generating a quote',
        variant: 'destructive',
      });
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <h1 className="text-3xl font-medium mb-6 designer-gradient-text">Create New Project</h1>
        <Card className="shadow-lg border-gray-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <CardTitle>Select Project Type</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ProjectTypeSelector 
              onSelectType={handleCreateProject}
              userRole="designer"
            />
          </CardContent>
          {projectId && (
            <CardFooter className="bg-gray-50 border-t border-gray-200 flex flex-wrap justify-between gap-4 p-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleEditProject}
                  className="fancy-btn"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Project Spaces
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBrowseModules}
                  className="fancy-btn"
                >
                  Browse Modules
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCreateQuote}
                  className="fancy-btn"
                >
                  <FileText size={16} className="mr-2" />
                  Create Quote
                </Button>
              </div>
              <Button 
                onClick={handleContinueTo3D}
                className="bg-blue-600 hover:bg-blue-700 shadow hover:shadow-lg transition-all btn-glow"
              >
                Continue to 3D Setup
                <Printer size={16} className="ml-2" />
                <ChevronRight size={14} className="ml-1" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default NewProject;
