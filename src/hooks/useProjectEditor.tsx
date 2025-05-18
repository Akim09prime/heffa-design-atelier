
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProjectService } from '@/services/projectService';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { PricingService } from '@/services/pricingService';
import { Project, FurnitureModule, Material, AccessoryItem } from '@/types';
import { useNavigate } from 'react-router-dom';

export const useProjectEditor = (projectId: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Selected module getter
  const selectedModule = project?.modules.find(m => m.id === selectedModuleId);

  // Fetch materials and accessories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch materials and accessories for pricing calculations
        const fetchedMaterials = await MaterialService.getAllMaterials();
        setMaterials(fetchedMaterials);
        
        const fetchedAccessories = await AccessoryService.getAllAccessories();
        setAccessories(fetchedAccessories);
      } catch (error) {
        console.error('Failed to fetch materials and accessories:', error);
        toast({
          title: 'Data Loading Issue',
          description: 'Some materials or accessories data could not be loaded',
          variant: 'destructive',
        });
      }
    };
    
    fetchData();
  }, [toast]);

  // Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          console.log(`Fetching project with ID: ${projectId}`);
          
          // For module IDs that start with "module-", create a temporary project
          if (projectId.startsWith('module-')) {
            const moduleId = projectId.replace('module-', '');
            console.log(`This is a module preview with ID: ${moduleId}`);
            
            // Create a temporary project for module preview
            const tempProject = {
              id: projectId,
              userId: 'designer',
              name: `Module Preview ${moduleId}`,
              description: 'Temporary project for module preview',
              type: 'Free Mode',
              parameters: {},
              status: 'draft',
              createdAt: new Date(),
              updatedAt: new Date(),
              roomType: 'other',
              modules: [],
              dimensions: {
                width: 3000,
                length: 3000,
                height: 2400,
                walls: ProjectService.generateDefaultWalls('Free Mode')
              }
            };
            
            setProject(tempProject as Project);
            setLoading(false);
            return;
          }
          
          const fetchedProject = await ProjectService.getProjectById(projectId);
          if (!fetchedProject) {
            console.error(`Project not found with ID: ${projectId}`);
            toast({
              title: 'Error',
              description: 'Project not found with the given ID',
              variant: 'destructive',
            });
            setProject(null);
          } else {
            console.log("Loaded project:", fetchedProject);
            setProject(fetchedProject);
          }
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  // Calculate total price
  useEffect(() => {
    if (project && materials.length > 0 && accessories.length > 0) {
      try {
        let total = 0;
        // Calculate individual module prices and sum them up
        project.modules.forEach(module => {
          const { total: modulePrice } = PricingService.calculateModulePrice(
            module,
            materials,
            accessories
          );
          total += modulePrice;
        });
        setTotalPrice(total);
      } catch (error) {
        console.error('Error calculating project price:', error);
      }
    }
  }, [project?.modules, materials, accessories]);

  // Handle save project
  const handleSave = async () => {
    if (!project) return;
    
    try {
      // Calculate final project price
      let finalPrice = 0;
      // Calculate individual module prices and sum them up
      project.modules.forEach(module => {
        const { total: modulePrice } = PricingService.calculateModulePrice(
          module,
          materials,
          accessories
        );
        finalPrice += modulePrice;
      });
      
      // Save the project to the database
      await ProjectService.updateProject(project.id, {
        modules: project.modules,
        parameters: {
          ...project.parameters,
          // Store a JSON representation of the scene for later loading
          scene3D: {
            modules: project.modules.map(m => ({
              id: m.id,
              type: m.type,
              price: m.price,
              dim: {
                L: m.width,
                H: m.height,
                A: m.depth
              },
              material: m.materials.find(mat => mat.part === 'body')?.materialId || '',
              front: {
                material: m.materials.find(mat => mat.part === 'door' || mat.part === 'drawer_front')?.materialId || '',
                paint: m.processingOptions.some(p => p.type === 'painting'),
                cnc: m.processingOptions.some(p => p.type === 'cnc_rifled') ? 'rifled' : ''
              },
              accessories: m.accessories.map(acc => acc.accessoryItemId),
              position: {
                x: m.position[0],
                y: m.position[1],
                z: m.position[2]
              },
              rotation: m.rotation[1] // Using y-rotation as main rotation
            })),
            totalPrice: finalPrice
          }
        },
        updatedAt: new Date()
      });
      
      return true; // Indicate successful save
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      });
      return false; // Indicate failed save
    }
  };

  // Navigation
  const handleBack = () => {
    // Check if we're viewing a module or a regular project
    if (projectId?.startsWith('module-')) {
      navigate('/designer/modules');
    } else {
      navigate('/designer/projects');
    }
  };

  // Module operations
  const handleAddModule = (newModule: FurnitureModule) => {
    if (!project) return;
    
    setProject({
      ...project,
      modules: [...project.modules, newModule]
    });
    
    setSelectedModuleId(newModule.id);
  };

  const handleUpdateModule = (updatedModule: FurnitureModule) => {
    if (!project) return;
    
    setProject({
      ...project,
      modules: project.modules.map(m => 
        m.id === updatedModule.id ? updatedModule : m
      )
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!project) return;
    
    setProject({
      ...project,
      modules: project.modules.filter(m => m.id !== moduleId)
    });
    
    setSelectedModuleId(null);
  };

  return {
    project,
    loading,
    showLibrary,
    showExportDialog,
    selectedModule,
    selectedModuleId,
    totalPrice,
    materials,
    accessories,
    handleBack,
    handleSave,
    handleAddModule,
    handleUpdateModule,
    handleDeleteModule,
    setSelectedModuleId,
    setShowLibrary,
    setShowExportDialog
  };
};
