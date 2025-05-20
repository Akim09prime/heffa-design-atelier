
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { ProjectQuoteForm } from '@/components/quotes/ProjectQuoteForm';
import { QuoteDetails } from '@/services/quoteService';
import { ProjectService } from '@/services/projectService';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { Project, Material, AccessoryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';

const ProjectQuote = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load project
        if (projectId) {
          const projectData = await ProjectService.getProjectById(projectId);
          if (!projectData) {
            toast({
              title: "Error",
              description: "Proiectul nu a fost găsit",
              variant: "destructive"
            });
            navigate('/designer/projects');
            return;
          }
          setProject(projectData);
        }
        
        // Load materials and accessories for price calculations
        const materialsData = await MaterialService.getAllMaterials();
        setMaterials(materialsData);
        
        const accessoriesData = await AccessoryService.getAllAccessories();
        setAccessories(accessoriesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "A apărut o eroare la încărcarea datelor",
          variant: "destructive"
        });
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [projectId, navigate, toast]);

  const handleQuoteGenerated = (quote: QuoteDetails) => {
    console.log("Quote generated:", quote);
    // In a real app, you might want to save the quote to the database
  };

  const handleBack = () => {
    navigate(`/designer/projects/${projectId}/3d-editor`);
  };

  if (isLoading) {
    return (
      <DesignerLayout>
        <div className="p-8 flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-designer-primary mx-auto"></div>
            <p className="mt-4 text-designer-primary font-medium">Se încarcă datele proiectului...</p>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  if (!project) {
    return (
      <DesignerLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Proiect negăsit</h2>
            <p className="text-gray-500 mb-6">Proiectul solicitat nu a fost găsit sau a fost șters.</p>
            <Button onClick={() => navigate('/designer/projects')}>
              Înapoi la proiecte
            </Button>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-2"
            >
              <ChevronLeft size={16} className="mr-1" /> Înapoi la proiect
            </Button>
            <h1 className="text-2xl font-medium designer-gradient-text">Generare ofertă: {project.name}</h1>
            <p className="text-gray-500 text-sm">
              Proiect {project.type}{project.subType ? ` (${project.subType})` : ''} | {project.modules.length} corpuri
            </p>
          </div>
        </div>

        <ProjectQuoteForm
          project={project}
          materials={materials}
          accessories={accessories}
          onQuoteGenerated={handleQuoteGenerated}
        />
      </div>
    </DesignerLayout>
  );
};

export default ProjectQuote;
