
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BodyPartType } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BodyService } from '@/services/bodyService';
import { Plus, Trash } from 'lucide-react';

type BodyDimensions = {
  width: number;
  height: number;
  depth: number;
};

type BodyPartsStepProps = {
  bodyDimensions: BodyDimensions;
  onDataChange: (data: { materialId: string, includeShelf: boolean, includeDrawer: boolean, customParts: any[] }) => void;
};

// Mock materials for selection
const materials = [
  { id: 'mat-1', name: 'Pal Alb W980', thickness: 18 },
  { id: 'mat-2', name: 'PFL Alb', thickness: 5 },
  { id: 'mat-3', name: 'MDF Lucios Alb', thickness: 18 },
  { id: 'mat-4', name: 'MDF Lucios Negru', thickness: 18 },
  { id: 'mat-5', name: 'Pal Stejar Natur', thickness: 18 },
];

export const BodyPartsStep: React.FC<BodyPartsStepProps> = ({
  bodyDimensions,
  onDataChange
}) => {
  const [materialId, setMaterialId] = useState('mat-1');
  const [includeShelf, setIncludeShelf] = useState(false);
  const [includeDrawer, setIncludeDrawer] = useState(false);
  const [customParts, setCustomParts] = useState<any[]>([]);
  const [partTypes] = useState(BodyService.getPartTypes());
  
  // New custom part form
  const [newPart, setNewPart] = useState({
    type: 'Raft' as BodyPartType,
    materialId: 'mat-1',
    thickness: 18,
    hasEdge: true,
    edgeSides: ['front', 'left', 'right'] as ('top' | 'bottom' | 'left' | 'right')[],
    finishType: 'raw' as 'raw' | 'painted',
    faceCount: 1 as 1 | 2
  });
  
  const handleMaterialChange = (value: string) => {
    setMaterialId(value);
    updateParentData(value, includeShelf, includeDrawer, customParts);
  };
  
  const handleShelfChange = (checked: boolean) => {
    setIncludeShelf(checked);
    updateParentData(materialId, checked, includeDrawer, customParts);
  };
  
  const handleDrawerChange = (checked: boolean) => {
    setIncludeDrawer(checked);
    updateParentData(materialId, includeShelf, checked, customParts);
  };
  
  const handleAddCustomPart = () => {
    const partToAdd = {
      ...newPart,
      // Calculate a price based on size
      pricePerPart: 35 + (newPart.hasEdge ? 10 : 0) + (newPart.faceCount === 2 ? 10 : 0)
    };
    
    const updatedParts = [...customParts, partToAdd];
    setCustomParts(updatedParts);
    updateParentData(materialId, includeShelf, includeDrawer, updatedParts);
    
    // Reset form for next part
    setNewPart({
      type: 'Raft' as BodyPartType,
      materialId: 'mat-1',
      thickness: 18,
      hasEdge: true,
      edgeSides: ['front', 'left', 'right'] as ('top' | 'bottom' | 'left' | 'right')[],
      finishType: 'raw' as 'raw' | 'painted',
      faceCount: 1 as 1 | 2
    });
  };
  
  const handleRemoveCustomPart = (index: number) => {
    const updatedParts = [...customParts];
    updatedParts.splice(index, 1);
    setCustomParts(updatedParts);
    updateParentData(materialId, includeShelf, includeDrawer, updatedParts);
  };
  
  const updateParentData = (
    materialId: string,
    includeShelf: boolean,
    includeDrawer: boolean,
    customParts: any[]
  ) => {
    onDataChange({
      materialId,
      includeShelf,
      includeDrawer,
      customParts
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Material principal</h3>
          <Select value={materialId} onValueChange={handleMaterialChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selectați materialul" />
            </SelectTrigger>
            <SelectContent>
              {materials.map(material => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name} ({material.thickness} mm)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-shelf"
                checked={includeShelf}
                onCheckedChange={handleShelfChange}
              />
              <Label htmlFor="include-shelf">Include raft intermediar</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-drawer"
                checked={includeDrawer}
                onCheckedChange={handleDrawerChange}
              />
              <Label htmlFor="include-drawer">Include sertar</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      <div className="space-y-6">
        <h3 className="font-medium">Adăugare componente personalizate</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="part-type">Tip componentă</Label>
            <Select
              value={newPart.type}
              onValueChange={(value) => setNewPart({ ...newPart, type: value as BodyPartType })}
            >
              <SelectTrigger id="part-type">
                <SelectValue placeholder="Selectați tipul" />
              </SelectTrigger>
              <SelectContent>
                {partTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="part-material">Material</Label>
            <Select
              value={newPart.materialId}
              onValueChange={(value) => setNewPart({ ...newPart, materialId: value })}
            >
              <SelectTrigger id="part-material">
                <SelectValue placeholder="Selectați materialul" />
              </SelectTrigger>
              <SelectContent>
                {materials.map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.thickness} mm)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="part-thickness">Grosime (mm)</Label>
            <Input
              id="part-thickness"
              type="number"
              value={newPart.thickness}
              onChange={(e) => setNewPart({ ...newPart, thickness: parseInt(e.target.value) || 18 })}
              min={3}
              max={38}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 h-10">
              <Checkbox
                id="has-edge"
                checked={newPart.hasEdge}
                onCheckedChange={(checked) => setNewPart({ ...newPart, hasEdge: !!checked })}
              />
              <Label htmlFor="has-edge">Aplicare cant</Label>
            </div>
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label>Aplicare cant pe:</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
              {['top', 'bottom', 'left', 'right'].map(side => (
                <div key={side} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edge-${side}`}
                    checked={newPart.edgeSides.includes(side as any)}
                    onCheckedChange={(checked) => {
                      const updatedSides = checked 
                        ? [...newPart.edgeSides, side as any]
                        : newPart.edgeSides.filter(s => s !== side);
                      setNewPart({ ...newPart, edgeSides: updatedSides });
                    }}
                    disabled={!newPart.hasEdge}
                  />
                  <Label htmlFor={`edge-${side}`} className="capitalize">
                    {side === 'top' ? 'Sus' : side === 'bottom' ? 'Jos' : side === 'left' ? 'Stânga' : 'Dreapta'}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-span-2">
            <Button 
              onClick={handleAddCustomPart}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adaugă componentă
            </Button>
          </div>
        </div>
      </div>
      
      {customParts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Componente personalizate adăugate</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tip</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Grosime</TableHead>
                  <TableHead>Cant</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customParts.map((part, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {partTypes.find(t => t.value === part.type)?.label || part.type}
                    </TableCell>
                    <TableCell>
                      {materials.find(m => m.id === part.materialId)?.name || part.materialId}
                    </TableCell>
                    <TableCell>{part.thickness} mm</TableCell>
                    <TableCell>
                      {part.hasEdge ? part.edgeSides.join(', ') : 'Nu'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCustomPart(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
