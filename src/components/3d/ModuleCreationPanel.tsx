
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { FurnitureModule, ModuleType, AccessoryType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Define Material types for dropdown
const materialTypes = ['PAL', 'MDF', 'AGT', 'MDF-AGT'];
const materialColors = {
  'PAL': [
    { name: 'White (W980)', code: '#FFFFFF', price: 75 },
    { name: 'Oak Natural', code: '#C1A57B', price: 85 },
    { name: 'Walnut Dark', code: '#5A3C1E', price: 95 },
    { name: 'Graphite Grey', code: '#3F464C', price: 85 }
  ],
  'MDF': [
    { name: 'White', code: '#F5F5F5', price: 110 },
    { name: 'Black', code: '#222222', price: 120 },
    { name: 'Grey', code: '#808080', price: 115 }
  ],
  'AGT': [
    { name: 'Arctic White', code: '#F8F8F8', price: 130 },
    { name: 'Mocha', code: '#7F5F4E', price: 140 },
    { name: 'Anthracite', code: '#383E42', price: 135 }
  ],
  'MDF-AGT': [
    { name: 'Premium White', code: '#FCFCFC', price: 150 },
    { name: 'Premium Oak', code: '#C9A77B', price: 160 },
    { name: 'Premium Grey', code: '#6D6E71', price: 155 }
  ]
};

// Accessory options
const accessoryOptions = {
  hinges: [
    { name: 'Blum Inserta', price: 25 },
    { name: 'Hafele Standard', price: 15 },
    { name: 'GTV Basic', price: 10 }
  ],
  slides: [
    { name: 'Blum Tandem', price: 45 },
    { name: 'Hafele Slido', price: 35 },
    { name: 'GTV Standard', price: 25 }
  ],
  feet: [
    { name: 'Fixed Aluminum', price: 8 },
    { name: 'Adjustable Plastic', price: 12 },
    { name: 'Decorative Wood', price: 18 }
  ],
  profiles: [
    { name: 'Classic', price: 35 },
    { name: 'Rounded', price: 45 },
    { name: 'Minimalist', price: 30 }
  ]
};

// Edge banding options
const edgeBandingOptions = [
  { name: 'None', price: 0 },
  { name: 'ABS 0.4mm', price: 5 },
  { name: 'ABS 2mm', price: 8 },
  { name: 'Real Wood', price: 12 }
];

interface ModuleCreationPanelProps {
  onAddModule: (module: FurnitureModule) => void;
  onClose?: () => void;
}

export const ModuleCreationPanel: React.FC<ModuleCreationPanelProps> = ({ onAddModule, onClose }) => {
  const [name, setName] = useState('New Module');
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(800);
  const [depth, setDepth] = useState(560);
  const [materialType, setMaterialType] = useState(materialTypes[0]);
  const [materialColor, setMaterialColor] = useState(materialColors[materialTypes[0]][0]);
  const [moduleType, setModuleType] = useState<ModuleType>('base_cabinet');
  const [painting, setPainting] = useState(false);
  const [edgeBanding, setEdgeBanding] = useState(edgeBandingOptions[1]);
  const [profile, setProfile] = useState(accessoryOptions.profiles[0].name);
  const [hinges, setHinges] = useState(accessoryOptions.hinges[0].name);
  const [slides, setSlides] = useState(accessoryOptions.slides[0].name);
  const [feet, setFeet] = useState(accessoryOptions.feet[0].name);
  const [pushSystem, setPushSystem] = useState(false);
  
  // Price calculation state
  const [materialCost, setMaterialCost] = useState(0);
  const [cncCost, setCncCost] = useState(0);
  const [paintingCost, setPaintingCost] = useState(0);
  const [accessoriesCost, setAccessoriesCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  
  const { toast } = useToast();

  // Calculate material cost
  const calculateMaterialCost = () => {
    // Convert dimensions from mm to m²
    const surfaceArea = (width / 1000) * (height / 1000);
    // Assume we need material for all sides (simplified)
    const totalArea = 2 * (
      (width * height) + 
      (width * depth) + 
      (height * depth)
    ) / 1000000; // convert to m²
    
    return totalArea * materialColor.price;
  };

  // Calculate CNC cutting cost
  const calculateCncCost = () => {
    const cncPricePerMeter = 6; // RON/m
    const linearCutLength = (width + height + depth) * 4; // mm
    return (linearCutLength / 1000) * cncPricePerMeter; // convert to m and calculate
  };

  // Calculate painting cost
  const calculatePaintingCost = () => {
    if (!painting) return 0;
    
    const paintingPricePerSqm = 110; // RON/m²
    const surfaceArea = 2 * (
      (width * height) + 
      (width * depth) + 
      (height * depth)
    ) / 1000000; // convert to m²
    
    return surfaceArea * paintingPricePerSqm;
  };

  // Calculate accessories cost
  const calculateAccessoriesCost = () => {
    const hingePrice = accessoryOptions.hinges.find(h => h.name === hinges)?.price || 0;
    const slidePrice = accessoryOptions.slides.find(s => s.name === slides)?.price || 0;
    const feetPrice = accessoryOptions.feet.find(f => f.name === feet)?.price || 0;
    const profilePrice = accessoryOptions.profiles.find(p => p.name === profile)?.price || 0;
    const pushPrice = pushSystem ? 15 : 0; // Fixed price for push system
    const edgeBandingPrice = edgeBanding.price;
    
    // Calculate edges length for edge banding cost
    const edgeLength = ((width * 2) + (height * 2)) / 1000; // in meters
    const edgeBandingTotalPrice = edgeLength * edgeBandingPrice;
    
    return hingePrice + slidePrice + feetPrice + profilePrice + pushPrice + edgeBandingTotalPrice;
  };

  // Update price calculations when inputs change
  useEffect(() => {
    const matCost = calculateMaterialCost();
    const cnc = calculateCncCost();
    const paint = calculatePaintingCost();
    const acc = calculateAccessoriesCost();
    
    setMaterialCost(matCost);
    setCncCost(cnc);
    setPaintingCost(paint);
    setAccessoriesCost(acc);
    setTotalCost(matCost + cnc + paint + acc);
  }, [width, height, depth, materialColor, painting, edgeBanding, profile, hinges, slides, feet, pushSystem]);

  // Create new module with calculated properties
  const handleCreateModule = () => {
    const moduleId = uuidv4();
    
    // Get the hinges and slides price for proper accessory creation
    const hingeItem = accessoryOptions.hinges.find(h => h.name === hinges);
    const slideItem = accessoryOptions.slides.find(s => s.name === slides);
    const feetItem = accessoryOptions.feet.find(f => f.name === feet);
    
    const newModule: FurnitureModule = {
      id: moduleId,
      name,
      description: `${name} - ${width}×${height}×${depth}mm`,
      type: moduleType,
      width,
      height,
      depth,
      position: [0, height / 2000, 0], // Position with y at half height (in meters)
      rotation: [0, 0, 0],
      materials: [
        {
          id: uuidv4(),
          type: materialType as any, // Cast to MaterialType
          materialId: materialColor.code,
          part: 'body',
          quantity: 2 * ((width * height) + (width * depth) + (height * depth)) / 1000000 // m²
        }
      ],
      accessories: [
        // Add hinges if specified
        ...(hingeItem ? [{
          id: uuidv4(),
          type: 'hinge' as AccessoryType,
          accessoryItemId: hinges,
          quantity: 2 // Default quantity
        }] : []),
        // Add slides if specified
        ...(slideItem ? [{
          id: uuidv4(),
          type: 'slide' as AccessoryType,
          accessoryItemId: slides,
          quantity: 1 // Default pair
        }] : []),
        // Add feet if specified
        ...(feetItem ? [{
          id: uuidv4(),
          type: 'foot' as AccessoryType,
          accessoryItemId: feet,
          quantity: 4 // Default quantity
        }] : []),
        // Add push system if selected
        ...(pushSystem ? [{
          id: uuidv4(),
          type: 'push_system' as AccessoryType,
          accessoryItemId: 'push_open',
          quantity: 1
        }] : [])
      ],
      processingOptions: [
        // Add edge banding if not "None"
        ...(edgeBanding.name !== 'None' ? [{
          id: uuidv4(),
          type: 'edge_banding' as any, // Cast to ProcessingType
          materialId: materialColor.code,
          area: ((width * 2) + (height * 2)) / 1000 // Edge length in meters
        }] : []),
        // Add painting if selected
        ...(painting ? [{
          id: uuidv4(),
          type: 'painting' as any, // Cast to ProcessingType
          materialId: materialColor.code,
          area: 2 * ((width * height) + (width * depth) + (height * depth)) / 1000000 // Surface area in m²
        }] : [])
      ],
      price: totalCost,
      thumbnailUrl: 'https://images.unsplash.com/photo-1602858707092-364211809c11?q=80&w=200'
    };
    
    // Post message to 3D environment
    window.postMessage({ 
      type: 'addModule',
      width: width / 1000, // Convert to meters
      height: height / 1000, // Convert to meters
      depth: depth / 1000, // Convert to meters
      color: materialColor.code,
      userData: {
        id: moduleId,
        type: moduleType,
        name: name
      }
    }, '*');
    
    // Add module to project
    onAddModule(newModule);
    
    // Show success message
    toast({
      title: "Module Created",
      description: `${name} has been added to your scene`,
      variant: "default"
    });
    
    // Close panel if a close function was provided
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Create New Module</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dimensions" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="dimensions" className="flex-1">Dimensions</TabsTrigger>
            <TabsTrigger value="materials" className="flex-1">Materials</TabsTrigger>
            <TabsTrigger value="accessories" className="flex-1">Accessories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dimensions" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="module-name">Module Name</Label>
              <Input 
                id="module-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter module name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module-type">Module Type</Label>
              <Select value={moduleType} onValueChange={(value) => setModuleType(value as ModuleType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base_cabinet">Base Cabinet</SelectItem>
                  <SelectItem value="wall_cabinet">Wall Cabinet</SelectItem>
                  <SelectItem value="tall_cabinet">Tall Cabinet</SelectItem>
                  <SelectItem value="drawer_unit">Drawer Unit</SelectItem>
                  <SelectItem value="corner_cabinet">Corner Cabinet</SelectItem>
                  <SelectItem value="island">Island</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="width-slider">Width: {width} mm</Label>
                  <Input 
                    type="number"
                    className="w-24"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
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
                  onValueChange={(value) => setWidth(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="height-slider">Height: {height} mm</Label>
                  <Input 
                    type="number"
                    className="w-24"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
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
                  onValueChange={(value) => setHeight(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="depth-slider">Depth: {depth} mm</Label>
                  <Input 
                    type="number"
                    className="w-24"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
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
                  onValueChange={(value) => setDepth(value[0])}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material-type">Material Type</Label>
              <Select 
                value={materialType} 
                onValueChange={(value) => {
                  setMaterialType(value);
                  setMaterialColor(materialColors[value][0]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((material) => (
                    <SelectItem key={material} value={material}>{material}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Color & Texture</Label>
              <div className="grid grid-cols-2 gap-2">
                {materialColors[materialType].map((color) => (
                  <div 
                    key={color.code}
                    className={`p-2 border rounded-md cursor-pointer ${materialColor.code === color.code ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
                    onClick={() => setMaterialColor(color)}
                  >
                    <div 
                      className="h-8 w-full rounded-md mb-2"
                      style={{ backgroundColor: color.code }}
                    />
                    <div className="text-sm">{color.name}</div>
                    <div className="text-xs text-gray-500">{color.price} RON/m²</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="painting" checked={painting} onCheckedChange={(checked) => setPainting(!!checked)} />
                <Label htmlFor="painting">Painting (110 RON/m²)</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edge-banding">Edge Banding</Label>
                <Select 
                  value={edgeBanding.name} 
                  onValueChange={(value) => {
                    const selected = edgeBandingOptions.find(option => option.name === value);
                    if (selected) setEdgeBanding(selected);
                  }}
                >
                  <SelectTrigger id="edge-banding">
                    <SelectValue placeholder="Select edge banding" />
                  </SelectTrigger>
                  <SelectContent>
                    {edgeBandingOptions.map((option) => (
                      <SelectItem key={option.name} value={option.name}>
                        {option.name} {option.price > 0 ? `(${option.price} RON/m)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile">Profile Type</Label>
                <Select value={profile} onValueChange={setProfile}>
                  <SelectTrigger id="profile">
                    <SelectValue placeholder="Select profile type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessoryOptions.profiles.map((option) => (
                      <SelectItem key={option.name} value={option.name}>
                        {option.name} ({option.price} RON)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessories" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hinges">Hinges</Label>
              <Select value={hinges} onValueChange={setHinges}>
                <SelectTrigger id="hinges">
                  <SelectValue placeholder="Select hinges" />
                </SelectTrigger>
                <SelectContent>
                  {accessoryOptions.hinges.map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name} ({option.price} RON/pc)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slides">Drawer Slides</Label>
              <Select value={slides} onValueChange={setSlides}>
                <SelectTrigger id="slides">
                  <SelectValue placeholder="Select drawer slides" />
                </SelectTrigger>
                <SelectContent>
                  {accessoryOptions.slides.map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name} ({option.price} RON/pair)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feet">Feet</Label>
              <Select value={feet} onValueChange={setFeet}>
                <SelectTrigger id="feet">
                  <SelectValue placeholder="Select feet" />
                </SelectTrigger>
                <SelectContent>
                  {accessoryOptions.feet.map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name} ({option.price} RON/set)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="push-system" checked={pushSystem} onCheckedChange={(checked) => setPushSystem(!!checked)} />
              <Label htmlFor="push-system">Push System (15 RON)</Label>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Price Breakdown */}
        <div className="mt-6 space-y-2 border-t pt-4">
          <h3 className="font-semibold">Price Breakdown</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Materials:</span>
              <span>{materialCost.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between">
              <span>CNC Processing:</span>
              <span>{cncCost.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between">
              <span>Painting:</span>
              <span>{paintingCost.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between">
              <span>Accessories:</span>
              <span>{accessoriesCost.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Total:</span>
              <span>{totalCost.toFixed(2)} RON</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {onClose && (
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
        )}
        <Button onClick={handleCreateModule}>
          Generate Module
        </Button>
      </CardFooter>
    </Card>
  );
};
