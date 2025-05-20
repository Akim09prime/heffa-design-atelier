
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X } from 'lucide-react';

// Sample preset data
const presets = [
  {
    id: 'preset-1',
    name: 'Corp suspendat 600mm',
    category: 'Bucătărie',
    previewUrl: 'https://via.placeholder.com/150x120',
    tags: ['suspendat', 'bucătărie'],
    width: 600,
    height: 720,
    depth: 320
  },
  {
    id: 'preset-2',
    name: 'Corp bază 600mm',
    category: 'Bucătărie',
    previewUrl: 'https://via.placeholder.com/150x120',
    tags: ['bază', 'bucătărie'],
    width: 600,
    height: 820,
    depth: 560
  },
  {
    id: 'preset-3',
    name: 'Dulap dormitor',
    category: 'Dormitor',
    previewUrl: 'https://via.placeholder.com/150x120',
    tags: ['dulap', 'dormitor'],
    width: 1200,
    height: 2100,
    depth: 600
  },
  {
    id: 'preset-4',
    name: 'Noptieră',
    category: 'Dormitor',
    previewUrl: 'https://via.placeholder.com/150x120',
    tags: ['noptieră', 'dormitor'],
    width: 450,
    height: 500,
    depth: 400
  },
  {
    id: 'preset-5',
    name: 'Dulap baie',
    category: 'Baie',
    previewUrl: 'https://via.placeholder.com/150x120',
    tags: ['dulap', 'baie'],
    width: 800,
    height: 820,
    depth: 460
  },
  {
    id: 'preset-6',
    name: 'Birou computer',
    category: 'Birou',
    previewUrl: 'https://via.placeholder.com/150x120',
    tags: ['birou', 'office'],
    width: 1200,
    height: 750,
    depth: 600
  }
];

type BodyPresetSelectorProps = {
  onSelect: (presetId: string) => void;
  onClose: () => void;
};

export const BodyPresetSelector: React.FC<BodyPresetSelectorProps> = ({
  onSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('toate');
  
  const categories = ['Bucătărie', 'Dormitor', 'Baie', 'Birou', 'Hol'];
  
  const filteredPresets = presets.filter(preset => {
    const matchesSearch = searchTerm === '' || 
      preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = activeTab === 'toate' || 
      preset.category.toLowerCase() === activeTab.toLowerCase();
      
    return matchesSearch && matchesCategory;
  });
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Selectează un corp presetat</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Alege un corp predefinit pentru a-l adăuga în spațiul tău.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Caută corp..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="toate">Toate</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredPresets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Niciun corp găsit pentru criteriile selectate.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPresets.map(preset => (
                  <Card 
                    key={preset.id} 
                    className="p-2 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSelect(preset.id)}
                  >
                    {preset.previewUrl ? (
                      <img 
                        src={preset.previewUrl} 
                        alt={preset.name}
                        className="w-full h-24 object-cover rounded-sm mb-2" 
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 rounded-sm flex items-center justify-center mb-2">
                        <span className="text-gray-400">Fără imagine</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-sm">{preset.name}</h3>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{preset.width} x {preset.height} x {preset.depth} mm</span>
                        <span>{preset.category}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
