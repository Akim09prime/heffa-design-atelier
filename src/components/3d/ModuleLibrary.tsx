
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Box, Sofa, BedDouble, Car } from 'lucide-react';
import { ModuleType, FurnitureModule } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Enhanced module templates with more details and better organized
const moduleTemplates = [
  {
    type: 'base_cabinet',
    name: 'Base Cabinet',
    description: 'Standard base cabinet with one door',
    width: 0.6,
    height: 0.72,
    depth: 0.56,
    thumbnailUrl: 'https://images.unsplash.com/photo-1602858707092-364211809c11?q=80&w=200',
    popularity: 4,
    price: 195,
    material: 'Oak veneer'
  },
  {
    type: 'wall_cabinet',
    name: 'Wall Cabinet',
    description: 'Standard wall cabinet with one door',
    width: 0.6,
    height: 0.7,
    depth: 0.3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=200',
    popularity: 3,
    price: 150,
    material: 'Matte white'
  },
  {
    type: 'drawer_unit',
    name: 'Drawer Unit',
    description: 'Base cabinet with 3 drawers',
    width: 0.6,
    height: 0.72,
    depth: 0.56,
    thumbnailUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=200',
    popularity: 5,
    price: 220,
    material: 'Walnut'
  },
  {
    type: 'tall_cabinet',
    name: 'Tall Cabinet',
    description: 'Full height storage cabinet',
    width: 0.6,
    height: 2.1,
    depth: 0.56,
    thumbnailUrl: 'https://images.unsplash.com/photo-1582903222802-6232c22eecf9?q=80&w=200',
    popularity: 2,
    price: 350,
    material: 'Birch'
  },
  {
    type: 'corner_cabinet',
    name: 'Corner Cabinet',
    description: 'L-shaped corner solution',
    width: 0.9,
    height: 0.72,
    depth: 0.9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1595428829549-5abfd52654e5?q=80&w=200',
    popularity: 3,
    price: 275,
    material: 'Acacia wood'
  },
  {
    type: 'island',
    name: 'Kitchen Island',
    description: 'Free-standing island unit',
    width: 1.2,
    height: 0.9,
    depth: 0.7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?q=80&w=200',
    popularity: 5,
    price: 450,
    material: 'Solid oak'
  }
];

// Helper function to assign colors based on module type
const getModuleColor = (type: ModuleType): string => {
  switch(type) {
    case 'base_cabinet': return '#C1A57B';
    case 'wall_cabinet': return '#d8c3a5';
    case 'drawer_unit': return '#ad9572';
    case 'tall_cabinet': return '#a68a64';
    case 'corner_cabinet': return '#b6976f';
    case 'island': return '#6A4B31';
    default: return '#C1A57B';
  }
};

// Helper function to get icon based on module type
const getModuleIcon = (type: ModuleType) => {
  switch(type) {
    case 'base_cabinet': return <Box className="h-5 w-5" />;
    case 'wall_cabinet': return <Box className="h-5 w-5" />;
    case 'tall_cabinet': return <Box className="h-5 w-5 rotate-90" />;
    case 'corner_cabinet': return <Box className="h-5 w-5" />;
    case 'drawer_unit': return <Box className="h-5 w-5" />;
    case 'island': return <Sofa className="h-5 w-5" />;
    default: return <Box className="h-5 w-5" />;
  }
};

interface ModuleLibraryProps {
  onAddModule: (module: FurnitureModule) => void;
  className?: string;
}

export const ModuleLibrary: React.FC<ModuleLibraryProps> = ({ onAddModule, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Function to create a new module based on template
  const createModule = (template: typeof moduleTemplates[0]) => {
    // Convert dimensions from meters to mm for internal processing
    const width = template.width * 1000;
    const height = template.height * 1000;
    const depth = template.depth * 1000;
    
    const moduleId = uuidv4();
    
    const newModule: FurnitureModule = {
      id: moduleId,
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
      price: template.price || 0,
      thumbnailUrl: template.thumbnailUrl
    };
    
    // Send message to 3D Canvas
    window.postMessage({ 
      type: 'addModule',
      width: template.width,
      height: template.height,
      depth: template.depth,
      color: getModuleColor(template.type as ModuleType),
      userData: {
        id: moduleId,
        type: template.type,
        name: template.name
      }
    }, '*');
    
    onAddModule(newModule);
  };

  // Filter modules based on search term and selected category
  const filteredModules = moduleTemplates.filter(module => {
    const matchesSearch = searchTerm === '' || 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.material.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || module.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter buttons
  const categories = Array.from(new Set(moduleTemplates.map(m => m.type)));
  
  return (
    <div className={`w-full bg-white p-4 flex flex-col h-full ${className}`}>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl font-semibold font-playfair text-[#6A4B31]">Mobilier Modular</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Caută module..." 
            className="pl-9 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? "bg-[#6A4B31] hover:bg-[#5a3f2a]" : ""}
        >
          Toate
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-[#6A4B31] hover:bg-[#5a3f2a]" : ""}
          >
            {getModuleIcon(category as ModuleType)}
            <span className="ml-2">
              {category === 'base_cabinet' ? 'Corpuri bază' : 
               category === 'wall_cabinet' ? 'Corpuri suspendate' :
               category === 'tall_cabinet' ? 'Corpuri înalte' :
               category === 'drawer_unit' ? 'Unități sertare' :
               category === 'corner_cabinet' ? 'Corpuri colț' :
               category === 'island' ? 'Insule' : category}
            </span>
          </Button>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <ScrollArea className="flex-1 pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredModules.map((template, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 group"
            >
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                {template.thumbnailUrl ? (
                  <img 
                    src={template.thumbnailUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Box className="h-16 w-16" />
                  </div>
                )}
                
                {template.popularity >= 4 && (
                  <Badge className="absolute top-3 right-3 bg-[#6A4B31]">Popular</Badge>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-lg font-medium text-white">{template.name}</h3>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-semibold text-[#6A4B31]">{template.price} €</span>
                  <span className="text-sm text-gray-500">{template.material}</span>
                </div>
                
                <CardDescription className="mb-2">
                  {template.description}
                </CardDescription>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <div>
                    <span className="block">Lățime</span>
                    <span className="font-medium">{template.width * 100} cm</span>
                  </div>
                  <div>
                    <span className="block">Înălțime</span>
                    <span className="font-medium">{template.height * 100} cm</span>
                  </div>
                  <div>
                    <span className="block">Adâncime</span>
                    <span className="font-medium">{template.depth * 100} cm</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button 
                  onClick={() => createModule(template)} 
                  className="w-full bg-[#6A4B31] hover:bg-[#5a3f2a] transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă în scenă
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredModules.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              <Box className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">Niciun modul găsit</h3>
              <p>Încearcă să schimbi criteriile de căutare</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
