
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, Plus, Box } from 'lucide-react';
import { FurnitureModule, ModuleType, ProjectType } from '@/types';
import { ModuleLibrary } from './ModuleLibrary';
import { v4 as uuidv4 } from 'uuid';

// Define module categories
const MODULE_CATEGORIES = [
  { value: 'base_cabinet', label: 'Base Cabinets' },
  { value: 'wall_cabinet', label: 'Wall Cabinets' },
  { value: 'tall_cabinet', label: 'Tall Cabinets' },
  { value: 'drawer_unit', label: 'Drawer Units' },
  { value: 'corner_cabinet', label: 'Corner Units' },
  { value: 'shelf_unit', label: 'Shelf Units' },
  { value: 'island', label: 'Islands' },
  { value: 'other', label: 'Other' },
];

// Sample predefined modules
const PREDEFINED_MODULES: Partial<FurnitureModule>[] = [
  {
    name: 'Base Cabinet 60cm',
    description: 'Standard base cabinet',
    type: 'base_cabinet',
    width: 600,
    height: 720,
    depth: 560,
    materials: [
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'body', quantity: 0.8 },
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'door', quantity: 0.4 },
      { id: uuidv4(), type: 'PFL', materialId: '6', part: 'back_panel', quantity: 0.4 }
    ],
    accessories: [
      { id: uuidv4(), type: 'hinge', accessoryItemId: '1', quantity: 2 },
      { id: uuidv4(), type: 'handle', accessoryItemId: '9', quantity: 1 }
    ],
    processingOptions: [],
    price: 0, // Will be calculated based on materials and accessories
  },
  {
    name: 'Wall Cabinet 60cm',
    description: 'Standard wall cabinet',
    type: 'wall_cabinet',
    width: 600,
    height: 720,
    depth: 320,
    materials: [
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'body', quantity: 0.6 },
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'door', quantity: 0.4 },
      { id: uuidv4(), type: 'PFL', materialId: '6', part: 'back_panel', quantity: 0.4 }
    ],
    accessories: [
      { id: uuidv4(), type: 'hinge', accessoryItemId: '1', quantity: 2 },
      { id: uuidv4(), type: 'handle', accessoryItemId: '9', quantity: 1 }
    ],
    processingOptions: [],
    price: 0,
  },
  {
    name: 'Drawer Unit 60cm',
    description: 'Three-drawer unit',
    type: 'drawer_unit',
    width: 600,
    height: 720,
    depth: 560,
    materials: [
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'body', quantity: 0.8 },
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'drawer_front', quantity: 0.6 }
    ],
    accessories: [
      { id: uuidv4(), type: 'slide', accessoryItemId: '3', quantity: 3 },
      { id: uuidv4(), type: 'handle', accessoryItemId: '9', quantity: 3 }
    ],
    processingOptions: [],
    price: 0,
  },
  {
    name: 'Tall Cabinet 60cm',
    description: 'Full-height cabinet',
    type: 'tall_cabinet',
    width: 600,
    height: 2100,
    depth: 560,
    materials: [
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'body', quantity: 1.8 },
      { id: uuidv4(), type: 'PAL', materialId: '1', part: 'door', quantity: 1.2 },
      { id: uuidv4(), type: 'PFL', materialId: '6', part: 'back_panel', quantity: 1.2 }
    ],
    accessories: [
      { id: uuidv4(), type: 'hinge', accessoryItemId: '1', quantity: 4 },
      { id: uuidv4(), type: 'handle', accessoryItemId: '9', quantity: 2 }
    ],
    processingOptions: [],
    price: 0,
  },
];

interface EditorSidebarProps {
  onClose: () => void;
  onAddModule: (module: FurnitureModule) => void;
  projectType: ProjectType;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ 
  onClose, 
  onAddModule,
  projectType 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleType | 'all'>('all');
  const [filteredModules, setFilteredModules] = useState(PREDEFINED_MODULES);

  useEffect(() => {
    // Filter modules based on search query and selected category
    let filtered = PREDEFINED_MODULES;
    
    if (searchQuery) {
      filtered = filtered.filter(module => 
        module.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        module.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(module => module.type === selectedCategory);
    }
    
    setFilteredModules(filtered);
  }, [searchQuery, selectedCategory]);

  const handleAddModule = (moduleTemplate: Partial<FurnitureModule>) => {
    // Create a new module instance with default position and uuid
    const newModule: FurnitureModule = {
      id: uuidv4(),
      name: moduleTemplate.name || 'New Module',
      description: moduleTemplate.description || '',
      type: moduleTemplate.type || 'base_cabinet',
      width: moduleTemplate.width || 600,
      height: moduleTemplate.height || 720,
      depth: moduleTemplate.depth || 560,
      position: [0, 0, 0], // Default position at center of room
      rotation: [0, 0, 0], // No rotation
      materials: moduleTemplate.materials || [],
      accessories: moduleTemplate.accessories || [],
      processingOptions: moduleTemplate.processingOptions || [],
      price: 0, // Will be calculated based on materials and accessories
      ...(moduleTemplate.modelUrl && { modelUrl: moduleTemplate.modelUrl }),
      ...(moduleTemplate.thumbnailUrl && { thumbnailUrl: moduleTemplate.thumbnailUrl }),
    };

    // Calculate price based on materials and accessories
    calculateModulePrice(newModule);
    
    // Add the new module to the project
    onAddModule(newModule);
  };

  // Helper function to calculate module price
  const calculateModulePrice = (module: FurnitureModule) => {
    // This would normally use actual price data from the database
    // For now we'll set a simple calculation based on dimensions
    const basePrice = (module.width / 100) * (module.height / 100) * (module.depth / 100) * 100;
    module.price = basePrice;
    return module;
  };

  return (
    <div className="w-80 border-r bg-white flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-medium">Module Library</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>All</TabsTrigger>
            <TabsTrigger value="base" onClick={() => setSelectedCategory('base_cabinet')}>Base</TabsTrigger>
            <TabsTrigger value="wall" onClick={() => setSelectedCategory('wall_cabinet')}>Wall</TabsTrigger>
            <TabsTrigger value="tall" onClick={() => setSelectedCategory('tall_cabinet')}>Tall</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full px-4 py-2">
            <ModuleLibrary modules={filteredModules} onSelectModule={handleAddModule} />
          </ScrollArea>
        </TabsContent>
        
        {/* All categories share the same content but with different filters applied via JS */}
        <TabsContent value="base" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full px-4 py-2">
            <ModuleLibrary modules={filteredModules} onSelectModule={handleAddModule} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="wall" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full px-4 py-2">
            <ModuleLibrary modules={filteredModules} onSelectModule={handleAddModule} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="tall" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full px-4 py-2">
            <ModuleLibrary modules={filteredModules} onSelectModule={handleAddModule} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t">
        <Button className="w-full" onClick={() => handleAddModule({
          name: 'Custom Module',
          description: 'Custom furniture module',
          type: 'other',
          width: 600,
          height: 720,
          depth: 560,
        })}>
          <Plus className="h-4 w-4 mr-2" /> Add Custom Module
        </Button>
      </div>
    </div>
  );
};
