
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import ProjectTypeSelector from '@/components/projects/ProjectTypeSelector';
import { Project, ProjectType, ProjectSubType } from '@/types';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

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
        userId: user.id,
        name: `My ${type} Project`,
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
      const createdProject = await ProjectService.createProject(newProject);

      toast({
        title: 'Project Created',
        description: `Your ${type} project has been created successfully`,
      });

      // Navigate to the project editor
      navigate(`/client/projects/${createdProject.id}`);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
      console.error('Project creation error:', error);
    }
  };

  return (
    <ClientLayout>
      <div className="p-6">
        <h1 className="client-header mb-6">Create New Project</h1>
        <Card glass variant="client" className="shadow-soft">
          <CardContent className="p-6">
            <ProjectTypeSelector 
              onSelectType={handleCreateProject}
              userRole="client"
            />
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default NewProject;
