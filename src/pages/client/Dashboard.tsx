
import React from 'react';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowRight } from 'lucide-react';
import { SceneContainer } from '../../components/3d/SceneContainer';
import { FurnitureModule } from '../../types';
import { useToast } from '@/hooks/use-toast';

// Sample data for demonstration
const recentProjects = [
  { id: '1', name: 'Modern Kitchen', type: 'kitchen', updatedAt: '2023-05-12', progress: 70 },
  { id: '2', name: 'Master Bedroom', type: 'bedroom', updatedAt: '2023-04-28', progress: 100 },
  { id: '3', name: 'Office Space', type: 'office', updatedAt: '2023-03-15', progress: 30 },
];

const suggestedModules: FurnitureModule[] = [
  {
    id: '1',
    name: 'Wall Cabinet',
    description: 'Modern wall cabinet with glass doors',
    type: 'wall_cabinet',
    width: 0.8,
    height: 0.6,
    depth: 0.3,
    position: [-0.5, 0.8, -1.8],
    rotation: [0, 0, 0],
    materials: [],
    accessories: [],
    processingOptions: [],
    price: 230,
    thumbnailUrl: '/wall-cabinet.jpg'
  },
  {
    id: '2',
    name: 'Base Cabinet',
    description: 'Base cabinet with drawers',
    type: 'base_cabinet',
    width: 0.9,
    height: 0.8,
    depth: 0.6,
    position: [0.5, 0.4, -1.8],
    rotation: [0, 0, 0],
    materials: [],
    accessories: [],
    processingOptions: [],
    price: 340,
    thumbnailUrl: '/base-cabinet.jpg'
  }
];

const Dashboard = () => {
  const { toast } = useToast();

  const handleButtonClick = (action: string, detail: string = '') => {
    toast({
      title: `${action}`,
      description: detail ? detail : `Action initiated for ${action}`,
    });
    console.log(`Action: ${action}, Detail: ${detail}`);
  };

  const handleProjectClick = (projectId: string, projectName: string) => {
    toast({
      title: "Opening project",
      description: `Loading ${projectName}...`,
    });
    console.log(`Opening project: ${projectId} - ${projectName}`);
  };

  return (
    <ClientLayout>
      <div className="p-6">
        {/* Hero section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-heffa-900">
                Design Your Dream Furniture
              </h1>
              <p className="mt-3 text-heffa-700 text-lg">
                Create, customize and visualize your perfect furniture with our 3D configurator.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="bg-heffa-600 hover:bg-heffa-700"
                onClick={() => handleButtonClick('New Project', 'Starting new furniture design project')}
              >
                <Plus size={18} className="mr-2" /> New Project
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleButtonClick('Browse Templates', 'Exploring design templates')}
              >
                Browse Templates
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Projects</CardTitle>
                <CardDescription>Continue working on your designs</CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <ul className="divide-y">
                  {recentProjects.map((project) => (
                    <li key={project.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{project.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.type} • Last edited {project.updatedAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-heffa-600" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleProjectClick(project.id, project.name)}
                          >
                            <ArrowRight size={18} />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="link" 
                  className="text-heffa-600"
                  onClick={() => handleButtonClick('View All Projects', 'Displaying all your projects')}
                >
                  View all projects
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-white p-4 rounded-xl shadow-sm h-80">
              <SceneContainer modules={suggestedModules} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Inspiration Gallery</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Explore furniture designs created by our designers
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleButtonClick('Browse Gallery', 'Exploring design inspiration')}
                  >
                    Browse Gallery
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Design Advisor</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Get AI assistance with your furniture design
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    size="sm" 
                    className="w-full bg-heffa-600 hover:bg-heffa-700"
                    onClick={() => handleButtonClick('Design Advisor', 'Starting AI-assisted design session')}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Popular modules */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display font-semibold text-heffa-900">Popular Modules</h2>
            <Button 
              variant="link" 
              className="text-heffa-600"
              onClick={() => handleButtonClick('View All Modules', 'Browsing all furniture modules')}
            >
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="material-card overflow-hidden">
                <div className="aspect-square bg-gray-100"></div>
                <CardContent className="p-4">
                  <h3 className="font-medium">Kitchen Cabinet {index + 1}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Modern design with premium materials
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold text-heffa-900">$249</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleButtonClick('Preview Module', `Previewing Kitchen Cabinet ${index + 1}`)}
                    >
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Dashboard;
