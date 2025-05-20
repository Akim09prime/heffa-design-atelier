
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid2X2, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BodyPart, BodyPartType, BodyPartPosition } from '@/types';
import { BodyService } from '@/services/bodyService';

interface BodyPartsStepProps {
  parts: BodyPart[];
  onAddPart: (part: Omit<BodyPart, 'id'>) => void;
  onRemovePart: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const partSchema = z.object({
  type: z.string(),
  material: z.string(),
  thickness: z.coerce.number().min(1),
  width: z.coerce.number().min(1),
  height: z.coerce.number().min(1),
  position: z.string()
});

type PartFormData = z.infer<typeof partSchema>;

export const BodyPartsStep: React.FC<BodyPartsStepProps> = ({
  parts,
  onAddPart,
  onRemovePart,
  onNext,
  onBack,
}) => {
  const [partTypes, setPartTypes] = useState<BodyPartType[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('PAL');
  const [edgeTop, setEdgeTop] = useState(false);
  const [edgeRight, setEdgeRight] = useState(false);
  const [edgeBottom, setEdgeBottom] = useState(false);
  const [edgeLeft, setEdgeLeft] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartFormData>({
    defaultValues: {
      type: 'side',
      material: 'PAL',
      thickness: 18,
      width: 600,
      height: 800,
      position: 'left'
    }
  });

  useEffect(() => {
    const loadPartTypes = async () => {
      try {
        const types = await BodyService.getPartTypes();
        setPartTypes(types);
      } catch (error) {
        console.error('Failed to load part types', error);
        // Set default part types if loading fails
        setPartTypes(["side", "top", "bottom", "shelf", "door", "drawer", "back"] as BodyPartType[]);
      }
    };
    
    loadPartTypes();
  }, []);

  const onSubmit = (data: PartFormData) => {
    onAddPart({
      type: data.type as BodyPartType,
      materialId: data.material,
      material: data.material, // For backward compatibility
      thickness: data.thickness,
      width: data.width,
      height: data.height,
      edge: {
        top: edgeTop,
        right: edgeRight,
        bottom: edgeBottom,
        left: edgeLeft
      },
      position: data.position as BodyPartPosition
    });
    
    // Reset form for next part
    reset();
    setEdgeTop(false);
    setEdgeRight(false);
    setEdgeBottom(false);
    setEdgeLeft(false);
  };

  const getTotalArea = () => {
    return parts.reduce((total, part) => {
      return total + (part.width * part.height / 1000000); // Convert to m²
    }, 0).toFixed(2);
  };

  const isValidPartConfig = () => {
    // This is a simplified validation, in a real app you'd have more comprehensive validation
    return parts.length >= 4;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Part form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Definire piese</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tip piesă</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează tipul piesei" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {partTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poziție</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează poziția" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="left">Stânga</SelectItem>
                          <SelectItem value="right">Dreapta</SelectItem>
                          <SelectItem value="top">Sus</SelectItem>
                          <SelectItem value="bottom">Jos</SelectItem>
                          <SelectItem value="back">Spate</SelectItem>
                          <SelectItem value="middle">Mijloc</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedMaterial(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează materialul" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PAL">PAL</SelectItem>
                          <SelectItem value="MDF">MDF</SelectItem>
                          <SelectItem value="HPL">HPL</SelectItem>
                          <SelectItem value="STICLA">Sticlă</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  name="thickness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grosime (mm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lățime (mm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Înălțime (mm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Edge banding options */}
              {selectedMaterial === 'PAL' && (
                <div className="pt-4">
                  <FormLabel>Canturi</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="edgeTop" 
                        checked={edgeTop} 
                        onCheckedChange={(checked) => setEdgeTop(!!checked)} 
                      />
                      <label htmlFor="edgeTop">Sus</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="edgeRight" 
                        checked={edgeRight} 
                        onCheckedChange={(checked) => setEdgeRight(!!checked)} 
                      />
                      <label htmlFor="edgeRight">Dreapta</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="edgeBottom" 
                        checked={edgeBottom} 
                        onCheckedChange={(checked) => setEdgeBottom(!!checked)} 
                      />
                      <label htmlFor="edgeBottom">Jos</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="edgeLeft" 
                        checked={edgeLeft} 
                        onCheckedChange={(checked) => setEdgeLeft(!!checked)} 
                      />
                      <label htmlFor="edgeLeft">Stânga</label>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="mt-4 w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă piesă
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Right column - Parts summary */}
      <div>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Grid2X2 className="h-5 w-5 mr-2" />
              Piese componente ({parts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {parts.length === 0 ? (
              <div className="text-center p-6 text-gray-500">
                Nu există piese adăugate încă.
                <br />
                Adaugă piese din formularul alăturat.
              </div>
            ) : (
              <div className="space-y-3">
                {parts.map((part) => (
                  <div 
                    key={part.id} 
                    className="p-3 border rounded-md bg-gray-50 relative"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => onRemovePart(part.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="font-medium">
                      {part.type.charAt(0).toUpperCase() + part.type.slice(1)} ({part.position})
                    </div>
                    <div className="text-sm text-gray-600">
                      Material: {part.material || part.materialId}, {part.thickness}mm
                    </div>
                    <div className="text-sm text-gray-600">
                      Dimensiuni: {part.width}×{part.height}mm
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          
          <div className="p-4 border-t mt-auto">
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>Suprafață totală:</span>
              <span>{getTotalArea()} m²</span>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={onBack}>
                Înapoi
              </Button>
              <Button 
                onClick={onNext} 
                disabled={!isValidPartConfig()}
              >
                Continuare
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
