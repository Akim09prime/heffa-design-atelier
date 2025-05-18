
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FurnitureModule } from '@/types';
import { Plus, Box } from 'lucide-react';

interface ModuleLibraryProps {
  modules: Partial<FurnitureModule>[];
  onSelectModule: (module: Partial<FurnitureModule>) => void;
}

export const ModuleLibrary: React.FC<ModuleLibraryProps> = ({ modules, onSelectModule }) => {
  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <Box className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-gray-500">No modules found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {modules.map((module, index) => (
        <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
          <div className="bg-gray-100 h-24 flex items-center justify-center">
            {module.thumbnailUrl ? (
              <img 
                src={module.thumbnailUrl} 
                alt={module.name} 
                className="h-full w-full object-contain" 
              />
            ) : (
              <Box className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{module.name}</h3>
                <p className="text-xs text-gray-500">
                  {module.width}×{module.height}×{module.depth} mm
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectModule(module);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
