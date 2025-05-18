import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, Box, ArrowRight, Plus, Printer, 
  Settings, Tag, Check 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Modules = () => {
  const [isNewModuleDialogOpen, setIsNewModuleDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('base');
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewModule = () => {
    setIsNewModuleDialogOpen(true);
  };

  const handleCreateModule = () => {
    setIsNewModuleDialogOpen(false);
    toast({
      title: "Module created",
      description: "Your new module has been created successfully",
    });
  };

  const handleContinueTo3D = (moduleId: number) => {
    toast({
      title: "Opening 3D Setup",
      description: "Preparing 3D environment for module configuration",
    });
    navigate(`/designer/modules/${moduleId}/3d-setup`);
  };

  const handleModuleClick = (moduleId: number) => {
    navigate(`/designer/modules/${moduleId}`);
  };

  const filterModules = (modules: any[]) => {
    if (!searchQuery) return modules;
    return modules.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Sample module data
  const getModulesForCategory = (category: string) => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i + 100,
      name: `${category.charAt(0).toUpperCase() + category.slice(1)}-${i+100}`,
      description: `Standard ${category} cabinet`,
      price: 275 + (i * 25),
      dimensions: category === 'base' ? '600×800×560mm' : 
                 category === 'wall' ? '600×300×560mm' : 
                 category === 'tall' ? '600×2100×560mm' :
                 category === 'drawer' ? '600×800×560mm' :
                 category === 'corner' ? '900×800×560mm' : '1200×800×560mm',
      popularity: Math.floor(Math.random() * 5) + 1,
    }));
  };

  const modules = getModulesForCategory(activeCategory);
  const filteredModules = filterModules(modules);

  return (
    <DesignerLayout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Furniture Modules</h1>
            <p className="text-muted-foreground">Browse and select pre-configured furniture modules</p>
          </div>
          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search modules..."
                className="w-full pl-9 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-gray-300 hover:border-gray-400 hover:bg-gray-100">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 shadow hover:shadow-lg transition-all duration-200"
              onClick={handleNewModule}
            >
              <Box className="h-4 w-4 mr-2" />
              New Module
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="base" 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-6"
        >
          <div className="overflow-x-auto pb-2">
            <TabsList className="mb-6 bg-white border border-gray-200 shadow-sm">
              <TabsTrigger value="base" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Base Cabinets</TabsTrigger>
              <TabsTrigger value="wall" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Wall Cabinets</TabsTrigger>
              <TabsTrigger value="tall" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Tall Cabinets</TabsTrigger>
              <TabsTrigger value="drawer" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Drawer Units</TabsTrigger>
              <TabsTrigger value="corner" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Corner Cabinets</TabsTrigger>
              <TabsTrigger value="island" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Islands</TabsTrigger>
            </TabsList>
          </div>
          
          {['base', 'wall', 'tall', 'drawer', 'corner', 'island'].map((category) => (
            <TabsContent key={category} value={category}>
              {filteredModules.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredModules.map((module, i) => (
                    <Card 
                      key={i} 
                      className={`overflow-hidden bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 ${
                        hoveredModule === i ? 'shadow-lg scale-[1.02]' : 'shadow'
                      }`}
                      onMouseEnter={() => setHoveredModule(i)}
                      onMouseLeave={() => setHoveredModule(null)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Box className="h-16 w-16 text-gray-400" />
                        </div>
                        {module.popularity >= 4 && (
                          <Badge className="absolute top-2 right-2 bg-blue-600">Popular</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{module.name}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm font-medium">€{module.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{module.dimensions}</p>
                        </div>
                        
                        <div className={`grid grid-cols-2 gap-2 mt-3 transition-opacity duration-200 ${
                          hoveredModule === i ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <Button 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => handleModuleClick(module.id)}
                          >
                            Configure
                            <Settings size={12} className="ml-1" />
                          </Button>
                          <Button 
                            className="text-xs bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleContinueTo3D(module.id)}
                          >
                            3D Setup
                            <Printer size={12} className="ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No modules found</p>
                    <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                    <Button onClick={() => setSearchQuery('')}>Clear search</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* New Module Dialog */}
        <Dialog open={isNewModuleDialogOpen} onOpenChange={setIsNewModuleDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
              <DialogDescription>
                Define the basic properties for your new furniture module.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  className="col-span-3"
                  placeholder="Enter module name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="base">Base Cabinet</option>
                  <option value="wall">Wall Cabinet</option>
                  <option value="tall">Tall Cabinet</option>
                  <option value="drawer">Drawer Unit</option>
                  <option value="corner">Corner Cabinet</option>
                  <option value="island">Island</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="width" className="text-right text-sm font-medium">
                  Width (mm)
                </label>
                <Input
                  id="width"
                  type="number"
                  className="col-span-3"
                  placeholder="600"
                  defaultValue="600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="depth" className="text-right text-sm font-medium">
                  Depth (mm)
                </label>
                <Input
                  id="depth"
                  type="number"
                  className="col-span-3"
                  placeholder="560"
                  defaultValue="560"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="height" className="text-right text-sm font-medium">
                  Height (mm)
                </label>
                <Input
                  id="height"
                  type="number"
                  className="col-span-3"
                  placeholder="800"
                  defaultValue="800"
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateModule} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DesignerLayout>
  );
};

export default Modules;
