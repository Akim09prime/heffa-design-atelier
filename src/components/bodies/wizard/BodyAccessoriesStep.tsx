import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash } from 'lucide-react';

type BodyDimensions = {
  width: number;
  height: number;
  depth: number;
};

type BodyAccessoriesStepProps = {
  bodyDimensions: BodyDimensions;
  onDataChange: (data: { customAccessories: any[] }) => void;
};

// Mock accessory data
const accessoryCategories = [
  { value: 'hinge', label: 'Balamale' },
  { value: 'slide', label: 'Glisiere' },
  { value: 'handle', label: 'Mânere' },
  { value: 'foot', label: 'Picioare' },
  { value: 'push', label: 'Sistem push' },
  { value: 'damper', label: 'Amortizoare' },
  { value: 'other', label: 'Alte accesorii' },
];

const accessoryBrands = [
  { category: 'hinge', brands: ['Blum', 'Hafele', 'GTV', 'FGV'] },
  { category: 'slide', brands: ['Blum', 'Hafele', 'GTV'] },
  { category: 'handle', brands: ['Hafele', 'Rejs', 'Cosma', 'Pamar'] },
  { category: 'foot', brands: ['Hafele', 'GTV', 'Rejs'] },
  { category: 'push', brands: ['Blum', 'Hafele', 'GTV'] },
  { category: 'damper', brands: ['Blum', 'Hafele'] },
  { category: 'other', brands: ['Diverse'] },
];

const accessorySystems = {
  'Blum': {
    'hinge': ['Clip Top', 'Clip Top Blumotion', 'Modul'],
    'slide': ['Tandem', 'Movento', 'Legrabox'],
    'push': ['Tip-On', 'Servo-Drive'],
    'damper': ['Blumotion']
  },
  'Hafele': {
    'hinge': ['Metallamat', 'Metallamat A', 'Duomatic'],
    'slide': ['Moovit', 'Matrix', 'Accuride'],
    'handle': ['Design H', 'Design A', 'Moderna'],
    'foot': ['Adjustable', 'Fixed', 'Decorative'],
    'push': ['Push-system'],
    'damper': ['Hafele Smuso']
  },
  'GTV': {
    'hinge': ['Stronghold', 'Basic', 'Advanced'],
    'slide': ['Versalite', 'Basic', 'Premium'],
    'foot': ['Standard', 'Premium', 'Adjustable'],
    'push': ['Push-open']
  },
  'FGV': {
    'hinge': ['Slide-on', 'Clip-on', 'Premium']
  },
  'Rejs': {
    'handle': ['Modern', 'Classic', 'Avangard'],
    'foot': ['Standard', 'Premium']
  },
  'Cosma': {
    'handle': ['Design', 'Classic', 'Modern']
  },
  'Pamar': {
    'handle': ['Design', 'Italian', 'Modern']
  },
  'Diverse': {
    'other': ['Diverse']
  }
};

// Predefined prices
const accessoryPrices = {
  'Blum': {
    'Clip Top': 18,
    'Clip Top Blumotion': 25,
    'Modul': 15,
    'Tandem': 45,
    'Movento': 55,
    'Legrabox': 75,
    'Tip-On': 35,
    'Servo-Drive': 120,
    'Blumotion': 22
  },
  'Hafele': {
    'Metallamat': 16,
    'Metallamat A': 18,
    'Duomatic': 12,
    'Moovit': 38,
    'Matrix': 42,
    'Accuride': 48,
    'Design H': 15,
    'Design A': 18,
    'Moderna': 22,
    'Adjustable': 8,
    'Fixed': 5,
    'Decorative': 12,
    'Push-system': 28,
    'Hafele Smuso': 20
  },
  'GTV': {
    'Stronghold': 10,
    'Basic': 8,
    'Advanced': 12,
    'Versalite': 32,
    'Premium': 38,
    'Standard': 6,
    'Adjustable': 7,
    'Push-open': 18
  },
  // ... other brands and their prices
};

export const BodyAccessoriesStep: React.FC<BodyAccessoriesStepProps> = ({
  bodyDimensions,
  onDataChange
}) => {
  const [customAccessories, setCustomAccessories] = useState<any[]>([]);
  
  // New accessory state
  const [newAccessory, setNewAccessory] = useState({
    category: 'hinge',
    brand: 'Blum',
    system: 'Clip Top',
    sizeMm: 110,
    quantity: 2,
    pricePerUnit: 18
  });
  
  // Available brands based on selected category
  const availableBrands = accessoryBrands
    .find(item => item.category === newAccessory.category)?.brands || [];
    
  // Available systems based on selected brand and category
  const availableSystems = (accessorySystems as any)[newAccessory.brand]?.[newAccessory.category] || [];
  
  const handleCategoryChange = (category: string) => {
    // Update category and reset dependent fields
    const brandOptions = accessoryBrands.find(item => item.category === category)?.brands || [];
    const newBrand = brandOptions.length > 0 ? brandOptions[0] : '';
    const systemOptions = (accessorySystems as any)[newBrand]?.[category] || [];
    const newSystem = systemOptions.length > 0 ? systemOptions[0] : '';
    const price = (accessoryPrices as any)[newBrand]?.[newSystem] || 10;
    
    setNewAccessory({
      category,
      brand: newBrand,
      system: newSystem,
      sizeMm: 110, // default size
      quantity: 2,
      pricePerUnit: price
    });
  };
  
  const handleBrandChange = (brand: string) => {
    // Update brand and reset dependent fields
    const systemOptions = (accessorySystems as any)[brand]?.[newAccessory.category] || [];
    const newSystem = systemOptions.length > 0 ? systemOptions[0] : '';
    const price = (accessoryPrices as any)[brand]?.[newSystem] || 10;
    
    setNewAccessory({
      ...newAccessory,
      brand,
      system: newSystem,
      pricePerUnit: price
    });
  };
  
  const handleSystemChange = (system: string) => {
    const price = (accessoryPrices as any)[newAccessory.brand]?.[system] || 10;
    
    setNewAccessory({
      ...newAccessory,
      system,
      pricePerUnit: price
    });
  };
  
  const handleAddAccessory = () => {
    const updatedAccessories = [...customAccessories, newAccessory];
    setCustomAccessories(updatedAccessories);
    onDataChange({ customAccessories: updatedAccessories });
    
    // Reset to defaults for next accessory
    const price = (accessoryPrices as any)[newAccessory.brand]?.[newAccessory.system] || 10;
    
    setNewAccessory({
      category: 'hinge',
      brand: 'Blum',
      system: 'Clip Top',
      sizeMm: 110,
      quantity: 2,
      pricePerUnit: price
    });
  };
  
  const handleRemoveAccessory = (index: number) => {
    const updatedAccessories = [...customAccessories];
    updatedAccessories.splice(index, 1);
    setCustomAccessories(updatedAccessories);
    onDataChange({ customAccessories: updatedAccessories });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Adăugare accesorii</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accessory-category">Categorie</Label>
              <Select
                value={newAccessory.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="accessory-category">
                  <SelectValue placeholder="Selectați categoria" />
                </SelectTrigger>
                <SelectContent>
                  {accessoryCategories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessory-brand">Brand</Label>
              <Select
                value={newAccessory.brand}
                onValueChange={handleBrandChange}
              >
                <SelectTrigger id="accessory-brand">
                  <SelectValue placeholder="Selectați brandul" />
                </SelectTrigger>
                <SelectContent>
                  {availableBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessory-system">Sistem</Label>
              <Select
                value={newAccessory.system}
                onValueChange={handleSystemChange}
              >
                <SelectTrigger id="accessory-system">
                  <SelectValue placeholder="Selectați sistemul" />
                </SelectTrigger>
                <SelectContent>
                  {availableSystems.map((system: string) => (
                    <SelectItem key={system} value={system}>
                      {system}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessory-size">Dimensiune (mm)</Label>
              <Input
                id="accessory-size"
                type="number"
                value={newAccessory.sizeMm}
                onChange={(e) => setNewAccessory({ ...newAccessory, sizeMm: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessory-quantity">Cantitate</Label>
              <Input
                id="accessory-quantity"
                type="number"
                value={newAccessory.quantity}
                onChange={(e) => setNewAccessory({ ...newAccessory, quantity: parseInt(e.target.value) || 0 })}
                min={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessory-price">Preț/buc (RON)</Label>
              <Input
                id="accessory-price"
                type="number"
                value={newAccessory.pricePerUnit}
                onChange={(e) => setNewAccessory({ ...newAccessory, pricePerUnit: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
              />
            </div>
            
            <div className="col-span-2">
              <Button
                onClick={handleAddAccessory}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adaugă accesoriu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {customAccessories.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Accesorii adăugate</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Sistem</TableHead>
                  <TableHead>Dimensiune</TableHead>
                  <TableHead>Cantitate</TableHead>
                  <TableHead>Preț/buc</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customAccessories.map((accessory, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {accessoryCategories.find(c => c.value === accessory.category)?.label || accessory.category}
                    </TableCell>
                    <TableCell>{accessory.brand}</TableCell>
                    <TableCell>{accessory.system}</TableCell>
                    <TableCell>{accessory.sizeMm} mm</TableCell>
                    <TableCell>{accessory.quantity}</TableCell>
                    <TableCell>{accessory.pricePerUnit} RON</TableCell>
                    <TableCell>{(accessory.quantity * accessory.pricePerUnit).toFixed(2)} RON</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAccessory(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total accesorii:</div>
                <div className="font-medium">
                  {customAccessories.reduce((sum, acc) => sum + (acc.quantity * acc.pricePerUnit), 0).toFixed(2)} RON
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
