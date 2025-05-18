
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { QuoteGenerator } from '@/components/quotes/QuoteGenerator';
import { ProjectService } from '@/services/projectService';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { Project, Material, AccessoryItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProjectQuote = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!projectId) {
          throw new Error('No project ID provided');
        }
        
        // Fetch project details
        const projectData = await ProjectService.getProjectById(projectId);
        if (!projectData) {
          throw new Error(`Project with ID ${projectId} not found`);
        }
        
        setProject(projectData);
        
        // Fetch materials and accessories in parallel
        const [fetchedMaterials, fetchedAccessories] = await Promise.all([
          MaterialService.getAllMaterials(),
          AccessoryService.getAllAccessories()
        ]);
        
        setMaterials(fetchedMaterials);
        setAccessories(fetchedAccessories);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load project data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId, toast]);

  const handleBackToProject = () => {
    if (projectId) {
      navigate(`/designer/projects/${projectId}`);
    } else {
      navigate('/designer/projects');
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBackToProject} className="mr-4">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-medium">Generate Quote</h1>
            <p className="text-muted-foreground">
              {project ? `Project: ${project.name}` : 'Loading project...'}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <h3 className="text-lg font-medium">Error Loading Data</h3>
            <p>{error}</p>
            <Button 
              onClick={handleBackToProject} 
              variant="outline" 
              className="mt-4 border-red-300"
            >
              Back to Projects
            </Button>
          </div>
        )}

        {!isLoading && !error && project && (
          <QuoteGenerator 
            project={project}
            materials={materials}
            accessories={accessories}
          />
        )}
      </div>
    </DesignerLayout>
  );
};

export default ProjectQuote;
