
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { ModuleType, FurnitureModule } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Sample module templates
const moduleTemplates = [
  {
    type: 'base_cabinet',
    name: 'Base Cabinet',
    description: 'Standard base cabinet with one door',
    width: 0.6,
    height: 0.72,
    depth: 0.56,
    thumbnailUrl: 'https://images.unsplash.com/photo-1602858707092-364211809c11?q=80&w=200',
  },
  {
    type: 'wall_cabinet',
    name: 'Wall Cabinet',
    description: 'Standard wall cabinet with one door',
    width: 0.6,
    height: 0.7,
    depth: 0.3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=200',
  },
  {
    type: 'drawer_unit',
    name: 'Drawer Unit',
    description: 'Base cabinet with 3 drawers',
    width: 0.6,
    height: 0.72,
    depth: 0.56,
    thumbnailUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=200',
  },
  {
    type: 'tall_cabinet',
    name: 'Tall Cabinet',
    description: 'Full height storage cabinet',
    width: 0.6,
    height: 2.1,
    depth: 0.56,
    thumbnailUrl: 'https://images.unsplash.com/photo-1582903222802-6232c22eecf9?q=80&w=200',
  },
  {
    type: 'corner_cabinet',
    name: 'Corner Cabinet',
    description: 'L-shaped corner solution',
    width: 0.9,
    height: 0.72,
    depth: 0.9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1595428829549-5abfd52654e5?q=80&w=200',
  },
  {
    type: 'island',
    name: 'Kitchen Island',
    description: 'Free-standing island unit',
    width: 1.2,
    height: 0.9,
    depth: 0.7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?q=80&w=200',
  }
];

interface ModuleLibraryProps {
  onAddModule: (module: FurnitureModule) => void;
  className?: string;
}

export const ModuleLibrary: React.FC<ModuleLibraryProps> = ({ onAddModule, className }) => {
  // Function to create a new module based on template
  const createModule = (template: typeof moduleTemplates[0]) => {
    // Convert dimensions from meters to mm for internal processing
    const width = template.width * 1000;
    const height = template.height * 1000;
    const depth = template.depth * 1000;
    
    const newModule: FurnitureModule = {
      id: uuidv4(),
      name: template.name,
      description: template.description,
      type: template.type as ModuleType,
      width,
      height,
      depth,
      position: [0, height / 2000, 0], // Position with y at half height (in meters)
      rotation: [0, 0, 0],
      materials: [],
      accessories: [],
      processingOptions: [],
      price: 0,
      thumbnailUrl: template.thumbnailUrl
    };
    
    onAddModule(newModule);
  };

  return (
    <div className={`w-64 border-r bg-white p-4 flex flex-col h-full ${className}`}>
      <h2 className="text-lg font-medium mb-4">Module Library</h2>
      <Separator className="mb-4" />
      
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 gap-4 pr-4">
          {moduleTemplates.map((template, index) => (
            <Card key={index} className="overflow-hidden shadow-sm">
              <div className="h-32 bg-gray-100 relative">
                {template.thumbnailUrl ? (
                  <img 
                    src={template.thumbnailUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Preview
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <CardTitle className="text-sm">{template.name}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {template.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-2">
                <Button 
                  onClick={() => createModule(template)} 
                  className="w-full text-xs h-8"
                  variant="default"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add to Scene
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
