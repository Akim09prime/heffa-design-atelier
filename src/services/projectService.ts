
import { Project, ProjectType, ProjectSubType, ProjectStatus, RoomType, Wall, UserRole } from '@/types';

// Sample projects data - making it accessible to the service methods
export const sampleProjects: Project[] = [
  {
    id: '1',
    userId: '1',
    name: 'Modern Kitchen',
    description: 'Modern kitchen with island and white cabinets',
    type: 'Kitchen',
    subType: 'Island',
    parameters: {
      dims: { width: 4000, length: 3000 },
      materials: ['PAL-EGG-W980-18', 'STICLA-6-FROST']
    },
    status: 'saved',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-05-12'),
    roomType: 'kitchen',
    modules: [],
    dimensions: {
      width: 4000,
      length: 3000,
      height: 2700,
      walls: []
    }
  },
  {
    id: '2',
    userId: '1',
    name: 'Master Bedroom',
    description: 'Master bedroom wardrobe',
    type: 'Bedroom',
    subType: 'Classic',
    parameters: {
      dims: { width: 3600, length: 600 },
      materials: ['PAL-EGG-W980-18', 'MDF-STD-18']
    },
    status: 'completed',
    createdAt: new Date('2023-04-28'),
    updatedAt: new Date('2023-04-28'),
    roomType: 'bedroom',
    modules: [],
    dimensions: {
      width: 3600,
      length: 600,
      height: 2400,
      walls: []
    }
  },
  {
    id: '3',
    userId: '2',
    name: 'Office Space',
    description: 'Office furniture with desk and cabinets',
    type: 'Free Mode',
    parameters: {
      dims: { width: 3000, length: 2500 },
      materials: ['MDF-AGT-WHITE']
    },
    status: 'draft',
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15'),
    roomType: 'office',
    modules: [],
    dimensions: {
      width: 3000,
      length: 2500,
      height: 2800,
      walls: []
    }
  }
];

// Define Project Service
export const ProjectService = {
  // Make sampleProjects accessible
  sampleProjects,
  
  // Get all projects
  getAllProjects: async (): Promise<Project[]> => {
    // In a real app, this would be an API call
    return Promise.resolve([...sampleProjects]);
  },

  // Get projects by user ID
  getProjectsByUserId: async (userId: string): Promise<Project[]> => {
    // In a real app, this would be an API call with filtering
    return Promise.resolve(sampleProjects.filter(project => project.userId === userId));
  },

  // Get project by ID
  getProjectById: async (id: string): Promise<Project | null> => {
    // In a real app, this would be an API call with filtering
    console.log(`Looking for project with ID: ${id}`);
    console.log(`Available projects: ${sampleProjects.map(p => p.id).join(', ')}`);
    
    // Special handling for module preview projects (module-XXX)
    if (id.startsWith('module-')) {
      const moduleId = id.replace('module-', '');
      console.log(`Creating temporary project for module preview with ID: ${moduleId}`);
      
      return Promise.resolve(ProjectService.createModulePreviewProject(moduleId));
    }
    
    // If the ID looks like a custom format (not numeric), check if it's a valid ID or create a temporary one
    if (id.length > 3 && isNaN(Number(id))) {
      // Check if it's from a URL and might have been shared from another system
      console.log(`Project ID ${id} appears to be a custom ID, checking if it exists`);
      
      // First check if it actually exists
      const project = sampleProjects.find(project => project.id === id);
      
      if (project) {
        return Promise.resolve(project);
      }
      
      // For demo purposes, create a temporary project with this ID
      console.log(`Creating temporary project for unknown ID: ${id}`);
      const tempProject: Project = {
        id: id,
        userId: 'guest',
        name: `Demo Project ${id.substring(0, 6)}`,
        description: 'Temporary demo project for preview',
        type: 'Free Mode',
        parameters: {},
        status: 'draft' as ProjectStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        roomType: 'other' as RoomType,
        modules: [],
        dimensions: {
          width: 3500,
          length: 3000,
          height: 2400,
          walls: ProjectService.generateDefaultWalls('Free Mode')
        }
      };
      
      // Add this temporary project to our sampleProjects so it persists during the session
      sampleProjects.push(tempProject);
      
      return Promise.resolve(tempProject);
    }
    
    const project = sampleProjects.find(project => project.id === id);
    
    if (!project) {
      console.log(`Project with ID ${id} not found`);
      return null;
    }
    
    console.log(`Found project: ${project.name}`);
    return Promise.resolve(project);
  },

  // Create new project
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    // In a real app, this would be an API call
    const newProject = {
      ...project,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Here we'd add the project to the database
    console.log('Creating new project:', newProject);
    
    // Add the project to sampleProjects for the demo
    sampleProjects.push(newProject as Project);
    console.log(`Project added to database with ID: ${newProject.id}`);
    console.log(`Available projects now: ${sampleProjects.map(p => p.id).join(', ')}`);
    
    return Promise.resolve(newProject as Project);
  },

  // Update project
  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    // In a real app, this would be an API call
    console.log(`Updating project ${id}:`, project);
    
    // Find the project to update
    const existingProjectIndex = sampleProjects.findIndex(p => p.id === id);
    
    if (existingProjectIndex === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    // Create updated project
    const updatedProject = {
      ...sampleProjects[existingProjectIndex],
      ...project,
      updatedAt: new Date()
    };
    
    // Here we'd update the project in the database
    sampleProjects[existingProjectIndex] = updatedProject;
    
    return Promise.resolve(updatedProject);
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    // In a real app, this would be an API call
    console.log(`Deleting project ${id}`);
    
    // Find the project index
    const projectIndex = sampleProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    // Here we'd delete the project from the database
    sampleProjects.splice(projectIndex, 1);
    
    return Promise.resolve();
  },

  // Validate project type and subtype
  validateProjectTypeConfig: (type: ProjectType, subType?: ProjectSubType): { valid: boolean, message?: string } => {
    if (type === 'Kitchen' && !subType) {
      return { valid: false, message: 'You must select a kitchen shape' };
    }
    
    if (type === 'Apartment' && !subType) {
      return { valid: false, message: 'You must specify apartment details' };
    }
    
    return { valid: true };
  },

  // Generate walls based on project type
  generateDefaultWalls: (type: ProjectType, subType?: ProjectSubType): Wall[] => {
    const walls: Wall[] = [];
    
    // Basic rectangular room (4 walls)
    if (type === 'Free Mode' || type === 'Living Room' || type === 'Bedroom') {
      // Front wall
      walls.push({
        id: 'wall-front',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        width: 4000,
        height: 2400
      });
      
      // Right wall
      walls.push({
        id: 'wall-right',
        position: [4000, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        width: 3000,
        height: 2400
      });
      
      // Back wall
      walls.push({
        id: 'wall-back',
        position: [4000, 0, 3000],
        rotation: [0, Math.PI, 0],
        width: 4000,
        height: 2400
      });
      
      // Left wall
      walls.push({
        id: 'wall-left',
        position: [0, 0, 3000],
        rotation: [0, -Math.PI / 2, 0],
        width: 3000,
        height: 2400
      });
    }
    
    // Kitchen with specific shapes
    if (type === 'Kitchen') {
      switch (subType) {
        case 'L-shape':
          // Front wall
          walls.push({
            id: 'wall-front',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            width: 4000,
            height: 2400
          });
          
          // Right wall
          walls.push({
            id: 'wall-right',
            position: [4000, 0, 0],
            rotation: [0, Math.PI / 2, 0],
            width: 3000,
            height: 2400
          });
          break;
          
        case 'U-shape':
          // Front wall
          walls.push({
            id: 'wall-front',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            width: 4000,
            height: 2400
          });
          
          // Right wall
          walls.push({
            id: 'wall-right',
            position: [4000, 0, 0],
            rotation: [0, Math.PI / 2, 0],
            width: 3000,
            height: 2400
          });
          
          // Back wall
          walls.push({
            id: 'wall-back',
            position: [4000, 0, 3000],
            rotation: [0, Math.PI, 0],
            width: 4000,
            height: 2400
          });
          break;
          
        default: // Straight
          // Single wall
          walls.push({
            id: 'wall-single',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            width: 4000,
            height: 2400
          });
          break;
      }
    }
    
    return walls;
  },

  // Check if user has access to project
  checkUserAccessToProject: (project: Project, userId: string, role: UserRole): boolean => {
    // Admin has access to all projects
    if (role === 'admin') return true;
    
    // Designers have access to their own projects
    if (role === 'designer' && project.userId === userId) return true;
    
    // Clients have access only to their own projects
    if (role === 'client' && project.userId === userId) return true;
    
    return false;
  },
  
  // Create a module preview project
  createModulePreviewProject: (moduleId: string): Project => {
    return {
      id: `module-${moduleId}`,
      userId: 'designer',
      name: `Module Preview ${moduleId}`,
      description: 'Temporary project for module preview',
      type: 'Free Mode',
      parameters: {},
      status: 'draft' as ProjectStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
      roomType: 'other' as RoomType,
      modules: [],
      dimensions: {
        width: 3000,
        length: 3000,
        height: 2400,
        walls: ProjectService.generateDefaultWalls('Free Mode')
      }
    };
  }
};
