
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProjectService } from '@/services/projectService';

export const useProjectsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("Kitchen");
  const [importUrl, setImportUrl] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await ProjectService.getAllProjects();
        // Format the projects to match the expected format
        const formattedProjects = projectsData.map(project => ({
          id: project.id,
          name: project.name,
          client: project.userId, // This should be replaced with actual client name in a real app
          createdAt: project.createdAt.toISOString().split('T')[0],
          deadline: new Date(project.createdAt.getTime() + 30*24*60*60*1000).toISOString().split('T')[0], // Example deadline
          status: project.status,
          modules: project.modules?.length || 0,
          progress: project.status === 'completed' ? 100 : Math.floor(Math.random() * 100) // Random progress for example
        }));
        setProjects(formattedProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Handle creating a new project
  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project Created",
      description: `Created new ${projectType} project: ${projectName}`,
    });

    // Navigate to the new project page
    navigate('/designer/projects/new');
    
    // Reset form and close dialog
    setProjectName("");
    setIsNewProjectDialogOpen(false);
  };

  // Handle viewing project details
  const handleViewProject = (projectId: string, projectName: string) => {
    toast({
      title: "Opening Project",
      description: `Loading ${projectName}...`,
    });
    navigate(`/designer/projects/${projectId}/3d-editor`);
  };

  // Handle importing a design
  const handleImportDesign = () => {
    setIsImportDialogOpen(true);
  };

  // Process the imported design
  const processImportedDesign = () => {
    if (!importUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid import URL or file path",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Design Imported",
      description: "Processing your imported design...",
    });

    // Navigate to the import handler page
    navigate('/designer/projects/import', { state: { importUrl } });
    
    // Reset form and close dialog
    setImportUrl("");
    setIsImportDialogOpen(false);
  };

  return {
    projects,
    loading,
    searchQuery,
    setSearchQuery,
    isNewProjectDialogOpen,
    setIsNewProjectDialogOpen,
    isImportDialogOpen,
    setIsImportDialogOpen,
    projectName,
    setProjectName,
    projectType,
    setProjectType,
    importUrl,
    setImportUrl,
    handleCreateProject,
    handleViewProject,
    handleImportDesign,
    processImportedDesign
  };
};
