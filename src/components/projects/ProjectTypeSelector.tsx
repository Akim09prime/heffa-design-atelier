
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectType, ProjectSubType } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';

interface ProjectTypeSelectorProps {
  onSelectType: (type: ProjectType, subType: ProjectSubType | undefined, parameters: Record<string, any>) => void;
  userRole: 'client' | 'designer' | 'admin';
}

const ProjectTypeSelector = ({ onSelectType, userRole }: ProjectTypeSelectorProps) => {
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [subType, setSubType] = useState<ProjectSubType | undefined>(undefined);
  const [parameters, setParameters] = useState<Record<string, any>>({});

  // Room-based furniture types
  const roomBasedTypes: { id: ProjectType; name: string; image: string; description: string }[] = [
    { 
      id: 'Kitchen', 
      name: 'Kitchen', 
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=300', 
      description: 'Custom kitchen cabinets and solutions' 
    },
    { 
      id: 'Living Room', 
      name: 'Living Room', 
      image: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?q=80&w=300', 
      description: 'Entertainment centers and storage' 
    },
    { 
      id: 'Bedroom', 
      name: 'Bedroom', 
      image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=300', 
      description: 'Wardrobes and bedroom furniture' 
    },
    { 
      id: 'Hallway', 
      name: 'Hallway', 
      image: 'https://images.unsplash.com/photo-1585128768444-49a072761bc3?q=80&w=300', 
      description: 'Hallway storage and organization' 
    },
    { 
      id: 'Bathroom', 
      name: 'Bathroom', 
      image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=300', 
      description: 'Vanities and bathroom cabinets' 
    },
    { 
      id: 'Balcony/Terrace', 
      name: 'Balcony/Terrace', 
      image: 'https://images.unsplash.com/photo-1653219966093-ef9d17d4301b?q=80&w=300', 
      description: 'Weather-resistant outdoor furniture' 
    }
  ];

  // Integrated projects
  const integratedTypes: { id: ProjectType; name: string; image: string; description: string }[] = [
    { 
      id: 'Apartment', 
      name: 'Apartment', 
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=300', 
      description: 'Full apartment furnishing' 
    },
    { 
      id: 'House/Villa', 
      name: 'House/Villa', 
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=300', 
      description: 'Custom solutions for houses' 
    },
  ];

  // Free Mode (mainly for designers)
  const freeMode = {
    id: 'Free Mode' as ProjectType,
    name: 'Free Mode',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=300',
    description: 'Custom creative projects without constraints'
  };

  // Handle project type selection
  const handleTypeSelect = (type: ProjectType) => {
    setSelectedType(type);
    setSubType(undefined);
    setParameters({});
  };

  // Handle project subtype selection
  const handleSubTypeSelect = (subTypeValue: ProjectSubType) => {
    setSubType(subTypeValue);
  };

  // Handle parameter change
  const handleParameterChange = (key: string, value: any) => {
    setParameters({ ...parameters, [key]: value });
  };

  // Handle project creation
  const handleContinue = () => {
    if (!selectedType) return;

    onSelectType(selectedType, subType, parameters);
  };

  // Check if current configuration is valid
  const isValid = () => {
    if (!selectedType) return false;

    // Kitchen requires a subtype
    if (selectedType === 'Kitchen' && !subType) return false;

    // Apartment requires parameters
    if (selectedType === 'Apartment' && (!parameters.rooms || parameters.rooms <= 0)) return false;

    // House/Villa requires parameters
    if (selectedType === 'House/Villa' && (!parameters.floors || parameters.floors <= 0)) return false;

    return true;
  };

  return (
    <div>
      {/* Step 1: Select Project Type */}
      {!selectedType && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Choose Project Type</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Room-Based Furniture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomBasedTypes.map((type) => (
                  <Card 
                    key={type.id} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-32 mb-3 overflow-hidden rounded-md">
                        <img 
                          src={type.image} 
                          alt={type.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardDescription>{type.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Integrated Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integratedTypes.map((type) => (
                  <Card 
                    key={type.id} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-32 mb-3 overflow-hidden rounded-md">
                        <img 
                          src={type.image} 
                          alt={type.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardDescription>{type.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Free Mode (mainly for designers) */}
            {userRole === 'designer' && (
              <div>
                <h3 className="text-lg font-medium mb-3">Designer Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTypeSelect(freeMode.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{freeMode.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-32 mb-3 overflow-hidden rounded-md">
                        <img 
                          src={freeMode.image} 
                          alt={freeMode.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardDescription>{freeMode.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Configure Project Details */}
      {selectedType && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedType(null)}
              className="font-normal"
            >
              Back to Types
            </Button>
            <span>›</span>
            <span className="font-medium">{selectedType}</span>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Configure {selectedType}</h2>

          {/* Kitchen Configuration */}
          {selectedType === 'Kitchen' && (
            <Card>
              <CardHeader>
                <CardTitle>Kitchen Shape</CardTitle>
                <CardDescription>Select the layout for your kitchen</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={subType} 
                  onValueChange={(value) => handleSubTypeSelect(value as ProjectSubType)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="Straight" id="straight" className="peer sr-only" />
                    <Label 
                      htmlFor="straight" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2/3 h-4 bg-heffa-600"></div>
                      </div>
                      <div className="font-medium">Straight</div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="L-shape" id="l-shape" className="peer sr-only" />
                    <Label 
                      htmlFor="l-shape" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full bg-gray-100 flex items-end justify-start">
                        <div className="w-2/3 h-4 bg-heffa-600"></div>
                        <div className="h-16 w-4 bg-heffa-600"></div>
                      </div>
                      <div className="font-medium">L-shape</div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="U-shape" id="u-shape" className="peer sr-only" />
                    <Label 
                      htmlFor="u-shape" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full bg-gray-100 flex items-end justify-between">
                        <div className="h-16 w-4 bg-heffa-600"></div>
                        <div className="w-2/3 h-4 bg-heffa-600 self-end"></div>
                        <div className="h-16 w-4 bg-heffa-600"></div>
                      </div>
                      <div className="font-medium">U-shape</div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="Island" id="island" className="peer sr-only" />
                    <Label 
                      htmlFor="island" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full bg-gray-100 flex flex-col items-center justify-between relative">
                        <div className="w-2/3 h-4 bg-heffa-600 mt-2"></div>
                        <div className="w-1/3 h-8 bg-heffa-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                      <div className="font-medium">Island</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Bedroom Configuration */}
          {selectedType === 'Bedroom' && (
            <Card>
              <CardHeader>
                <CardTitle>Wardrobe Type</CardTitle>
                <CardDescription>Select the wardrobe type for your bedroom</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={subType} 
                  onValueChange={(value) => handleSubTypeSelect(value as ProjectSubType)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="Sliding" id="sliding" className="peer sr-only" />
                    <Label 
                      htmlFor="sliding" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full bg-gray-100 flex items-center justify-center">
                        <div className="w-full h-20 border-2 border-heffa-600 flex">
                          <div className="flex-1 border-r-2 border-heffa-600"></div>
                          <div className="flex-1"></div>
                        </div>
                      </div>
                      <div className="font-medium">Sliding Doors</div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="Classic" id="classic" className="peer sr-only" />
                    <Label 
                      htmlFor="classic" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full bg-gray-100 flex items-center justify-center">
                        <div className="w-full h-20 border-2 border-heffa-600 flex">
                          <div className="flex-1 border-r-2 border-heffa-600"></div>
                          <div className="flex-1 border-r-2 border-heffa-600"></div>
                          <div className="flex-1"></div>
                        </div>
                      </div>
                      <div className="font-medium">Classic Hinged Doors</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Bathroom Configuration */}
          {selectedType === 'Bathroom' && (
            <Card>
              <CardHeader>
                <CardTitle>Front Material</CardTitle>
                <CardDescription>Select the front material for your bathroom furniture</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={subType} 
                  onValueChange={(value) => handleSubTypeSelect(value as ProjectSubType)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="Glass" id="glass" className="peer sr-only" />
                    <Label 
                      htmlFor="glass" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full overflow-hidden rounded">
                        <img src="https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?q=80&w=200" alt="Glass Front" className="w-full h-full object-cover" />
                      </div>
                      <div className="font-medium">Glass Front</div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="MDF" id="mdf" className="peer sr-only" />
                    <Label 
                      htmlFor="mdf" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-3 h-24 w-full overflow-hidden rounded">
                        <img src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=200" alt="MDF Front" className="w-full h-full object-cover" />
                      </div>
                      <div className="font-medium">MDF Front</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Apartment Configuration */}
          {selectedType === 'Apartment' && (
            <Card>
              <CardHeader>
                <CardTitle>Apartment Details</CardTitle>
                <CardDescription>Specify the apartment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Number of Rooms</Label>
                    <Input 
                      id="rooms" 
                      type="number" 
                      min="1"
                      value={parameters.rooms || ''}
                      onChange={(e) => handleParameterChange('rooms', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input 
                      id="bathrooms" 
                      type="number" 
                      min="1"
                      value={parameters.bathrooms || ''}
                      onChange={(e) => handleParameterChange('bathrooms', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kitchens">Kitchens</Label>
                    <Input 
                      id="kitchens" 
                      type="number" 
                      min="1"
                      value={parameters.kitchens || ''}
                      onChange={(e) => handleParameterChange('kitchens', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* House/Villa Configuration */}
          {selectedType === 'House/Villa' && (
            <Card>
              <CardHeader>
                <CardTitle>House/Villa Details</CardTitle>
                <CardDescription>Specify the house or villa details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floors">Floors</Label>
                    <Input 
                      id="floors" 
                      type="number" 
                      min="1"
                      value={parameters.floors || ''}
                      onChange={(e) => handleParameterChange('floors', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Rooms</Label>
                    <Input 
                      id="rooms" 
                      type="number" 
                      min="1"
                      value={parameters.rooms || ''}
                      onChange={(e) => handleParameterChange('rooms', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input 
                      id="bathrooms" 
                      type="number" 
                      min="1"
                      value={parameters.bathrooms || ''}
                      onChange={(e) => handleParameterChange('bathrooms', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kitchens">Kitchens</Label>
                    <Input 
                      id="kitchens" 
                      type="number" 
                      min="1"
                      value={parameters.kitchens || ''}
                      onChange={(e) => handleParameterChange('kitchens', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                {/* Additional features checkboxes */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="hasAttic" 
                      checked={parameters.hasAttic || false}
                      onChange={(e) => handleParameterChange('hasAttic', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="hasAttic">Attic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="hasBasement" 
                      checked={parameters.hasBasement || false}
                      onChange={(e) => handleParameterChange('hasBasement', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="hasBasement">Basement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="hasTerrace" 
                      checked={parameters.hasTerrace || false}
                      onChange={(e) => handleParameterChange('hasTerrace', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="hasTerrace">Terrace</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <CardFooter className="flex justify-end pt-6">
            <Button 
              onClick={handleContinue} 
              disabled={!isValid()}
              className="flex items-center gap-2 bg-heffa-600 hover:bg-heffa-700"
            >
              Continue to 3D Setup
              <ChevronRight size={16} />
            </Button>
          </CardFooter>
        </div>
      )}
    </div>
  );
};

export default ProjectTypeSelector;
