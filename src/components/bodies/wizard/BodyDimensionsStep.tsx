
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

type BodyDimensions = {
  name: string;
  width: number;
  height: number;
  depth: number;
};

type BodyDimensionsStepProps = {
  initialData: BodyDimensions;
  onDataChange: (data: BodyDimensions) => void;
};

export const BodyDimensionsStep: React.FC<BodyDimensionsStepProps> = ({
  initialData,
  onDataChange
}) => {
  const [name, setName] = React.useState(initialData.name);
  const [width, setWidth] = React.useState(initialData.width);
  const [height, setHeight] = React.useState(initialData.height);
  const [depth, setDepth] = React.useState(initialData.depth);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    onDataChange({ name: newName, width, height, depth });
  };
  
  const handleWidthChange = (value: number[]) => {
    const newWidth = value[0];
    setWidth(newWidth);
    onDataChange({ name, width: newWidth, height, depth });
  };
  
  const handleHeightChange = (value: number[]) => {
    const newHeight = value[0];
    setHeight(newHeight);
    onDataChange({ name, width, height: newHeight, depth });
  };
  
  const handleDepthChange = (value: number[]) => {
    const newDepth = value[0];
    setDepth(newDepth);
    onDataChange({ name, width, height, depth: newDepth });
  };
  
  const handleWidthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setWidth(newWidth);
    onDataChange({ name, width: newWidth, height, depth });
  };
  
  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setHeight(newHeight);
    onDataChange({ name, width, height: newHeight, depth });
  };
  
  const handleDepthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDepth = parseInt(e.target.value) || 0;
    setDepth(newDepth);
    onDataChange({ name, width, height, depth: newDepth });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="body-name">Nume corp</Label>
        <Input 
          id="body-name"
          value={name} 
          onChange={handleNameChange} 
          placeholder="Introduceți numele corpului" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="width-slider">Lățime (mm)</Label>
                <Input
                  id="width-input"
                  className="w-20"
                  type="number"
                  value={width}
                  onChange={handleWidthInputChange}
                  min={200}
                  max={1200}
                />
              </div>
              <Slider
                id="width-slider"
                value={[width]}
                min={200}
                max={1200}
                step={10}
                onValueChange={handleWidthChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="height-slider">Înălțime (mm)</Label>
                <Input
                  id="height-input"
                  className="w-20"
                  type="number"
                  value={height}
                  onChange={handleHeightInputChange}
                  min={200}
                  max={2400}
                />
              </div>
              <Slider
                id="height-slider"
                value={[height]}
                min={200}
                max={2400}
                step={10}
                onValueChange={handleHeightChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="depth-slider">Adâncime (mm)</Label>
                <Input
                  id="depth-input"
                  className="w-20"
                  type="number"
                  value={depth}
                  onChange={handleDepthInputChange}
                  min={200}
                  max={800}
                />
              </div>
              <Slider
                id="depth-slider"
                value={[depth]}
                min={200}
                max={800}
                step={10}
                onValueChange={handleDepthChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <div className="relative border rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50">
          <div 
            className="bg-gray-200 border border-gray-300 relative" 
            style={{ 
              width: `${Math.min(width / 4, 200)}px`, 
              height: `${Math.min(height / 4, 150)}px`,
              maxWidth: '80%',
              maxHeight: '80%'
            }}
          >
            <div className="absolute top-1/2 left-full -translate-y-1/2 flex items-center">
              <div className="h-0.5 w-10 bg-gray-400"></div>
              <span className="text-sm whitespace-nowrap ml-2">{depth} mm</span>
            </div>
            
            <div className="absolute left-1/2 bottom-full -translate-x-1/2 flex flex-col items-center">
              <span className="text-sm whitespace-nowrap mb-1">{width} mm</span>
              <div className="h-10 w-0.5 bg-gray-400"></div>
            </div>
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="h-10 w-0.5 bg-gray-400"></div>
              <span className="text-sm whitespace-nowrap mt-1">{height} mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
