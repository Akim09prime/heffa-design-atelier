import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AccessoryItem, AccessoryType, ModuleType } from '@/types';
import { AlertCircle } from 'lucide-react';

interface AccessoryFormProps {
  accessory: Partial<AccessoryItem>;
  onChange: (field: keyof AccessoryItem, value: any) => void;
  isEditing?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export const AccessoryForm: React.FC<AccessoryFormProps> = ({
  accessory,
  onChange,
  isEditing = false,
  onValidationChange
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const accessoryTypes: AccessoryType[] = [
    'hinge', 
    'slide', 
    'handle', 
    'foot', 
    'profile', 
    'push_system', 
    'shelf_support', 
    'other'
  ];
  
  const compatibilityOptions: {value: ModuleType, label: string}[] = [
    { value: 'base_cabinet', label: 'Base Cabinet' },
    { value: 'wall_cabinet', label: 'Wall Cabinet' },
    { value: 'tall_cabinet', label: 'Tall Cabinet' },
    { value: 'drawer_unit', label: 'Drawer Unit' },
    { value: 'shelf_unit', label: 'Shelf Unit' }
  ];
  
  const manufacturers = [
    'Blum', 
    'Hafele', 
    'GTV', 
    'Other'
  ];

  // Validate form on accessory change
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Code validation
    if (!accessory.code?.trim()) {
      newErrors.code = 'Product code is required';
    }
    
    // Name validation
    if (!accessory.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Type validation
    if (!accessory.type) {
      newErrors.type = 'Type is required';
    }
    
    // Manufacturer validation
    if (!accessory.manufacturer) {
      newErrors.manufacturer = 'Manufacturer is required';
    }
    
    // Price validation
    if (!accessory.price && accessory.price !== 0) {
      newErrors.price = 'Price is required';
    } else if (accessory.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    // Compatibility validation
    if (!accessory.compatibility || accessory.compatibility.length === 0) {
      newErrors.compatibility = 'At least one compatibility option is required';
    }
    
    setErrors(newErrors);
    
    // Inform parent component about validation state
    if (onValidationChange) {
      onValidationChange(Object.keys(newErrors).length === 0);
    }
  }, [accessory, onValidationChange]);

  const handleCompatibilityChange = (value: ModuleType, checked: boolean) => {
    const currentCompatibility = accessory.compatibility || [];
    
    const newCompatibility = checked
      ? [...currentCompatibility, value]
      : currentCompatibility.filter(item => item !== value);
    
    onChange('compatibility', newCompatibility);
  };
  
  const handlePropertyChange = (key: string, value: any) => {
    const properties = accessory.properties || {};
    onChange('properties', { ...properties, [key]: value });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="code" className="text-right pt-2">Code*</Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="code" 
            className={errors.code ? "border-red-500" : ""}
            value={accessory.code || ''}
            onChange={(e) => onChange('code', e.target.value)}
            placeholder="Enter product code"
          />
          {errors.code && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.code}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="name" className="text-right pt-2">Name*</Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="name" 
            className={errors.name ? "border-red-500" : ""}
            value={accessory.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter accessory name"
          />
          {errors.name && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.name}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="type" className="text-right pt-2">Type*</Label>
        <div className="col-span-3 space-y-1">
          <Select 
            value={accessory.type || ''} 
            onValueChange={(value) => onChange('type', value as AccessoryType)}
          >
            <SelectTrigger id="type" className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select accessory type" />
            </SelectTrigger>
            <SelectContent>
              {accessoryTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.type}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="manufacturer" className="text-right pt-2">Manufacturer*</Label>
        <div className="col-span-3 space-y-1">
          <Select 
            value={accessory.manufacturer || ''} 
            onValueChange={(value) => onChange('manufacturer', value)}
          >
            <SelectTrigger id="manufacturer" className={errors.manufacturer ? "border-red-500" : ""}>
              <SelectValue placeholder="Select manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map(manufacturer => (
                <SelectItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.manufacturer && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.manufacturer}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="price" className="text-right pt-2">Price*</Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="price" 
            type="number"
            step="0.01" 
            className={errors.price ? "border-red-500" : ""}
            value={accessory.price || ''}
            onChange={(e) => onChange('price', parseFloat(e.target.value))}
            placeholder="Enter price"
          />
          {errors.price && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.price}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="imageUrl" className="text-right pt-2">Image URL</Label>
        <div className="col-span-3">
          <Input 
            id="imageUrl" 
            value={accessory.imageUrl || ''}
            onChange={(e) => onChange('imageUrl', e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="pdfUrl" className="text-right pt-2">PDF URL</Label>
        <div className="col-span-3">
          <Input 
            id="pdfUrl" 
            value={accessory.pdfUrl || ''}
            onChange={(e) => onChange('pdfUrl', e.target.value)}
            placeholder="Enter specification PDF URL"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">Compatibility*</Label>
        <div className="col-span-3 space-y-1">
          <div className="grid grid-cols-2 gap-2">
            {compatibilityOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`compatibility-${option.value}`} 
                  checked={(accessory.compatibility || []).includes(option.value)}
                  onCheckedChange={(checked) => handleCompatibilityChange(option.value, checked === true)}
                />
                <Label htmlFor={`compatibility-${option.value}`} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.compatibility && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.compatibility}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2">Properties</Label>
        <div className="col-span-3">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground mb-2">
              Add properties specific to this accessory type
            </p>
            
            {accessory.type === 'hinge' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="property-openAngle" className="text-xs">Opening Angle (°)</Label>
                    <Input 
                      id="property-openAngle" 
                      type="number" 
                      className="mt-1 h-8"
                      value={accessory.properties?.openAngle || ''}
                      onChange={(e) => handlePropertyChange('openAngle', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="property-material" className="text-xs">Material</Label>
                    <Input 
                      id="property-material" 
                      className="mt-1 h-8"
                      value={accessory.properties?.material || ''}
                      onChange={(e) => handlePropertyChange('material', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="property-softClose" 
                    checked={accessory.properties?.softClose === true}
                    onCheckedChange={(checked) => handlePropertyChange('softClose', checked === true)}
                  />
                  <Label htmlFor="property-softClose" className="text-xs font-normal">
                    Soft close
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="property-includesMountPlate" 
                    checked={accessory.properties?.includesMountPlate === true}
                    onCheckedChange={(checked) => handlePropertyChange('includesMountPlate', checked === true)}
                  />
                  <Label htmlFor="property-includesMountPlate" className="text-xs font-normal">
                    Includes mounting plate
                  </Label>
                </div>
              </div>
            )}
            
            {accessory.type === 'slide' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="property-length" className="text-xs">Length (mm)</Label>
                    <Input 
                      id="property-length" 
                      type="number" 
                      className="mt-1 h-8"
                      value={accessory.properties?.length || ''}
                      onChange={(e) => handlePropertyChange('length', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="property-loadCapacity" className="text-xs">Load Capacity (kg)</Label>
                    <Input 
                      id="property-loadCapacity" 
                      type="number" 
                      className="mt-1 h-8"
                      value={accessory.properties?.loadCapacity || ''}
                      onChange={(e) => handlePropertyChange('loadCapacity', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="property-softClose" 
                    checked={accessory.properties?.softClose === true}
                    onCheckedChange={(checked) => handlePropertyChange('softClose', checked === true)}
                  />
                  <Label htmlFor="property-softClose" className="text-xs font-normal">
                    Soft close
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="property-fullExtension" 
                    checked={accessory.properties?.fullExtension === true}
                    onCheckedChange={(checked) => handlePropertyChange('fullExtension', checked === true)}
                  />
                  <Label htmlFor="property-fullExtension" className="text-xs font-normal">
                    Full extension
                  </Label>
                </div>
              </div>
            )}
            
            {/* Add more property forms based on accessory.type */}
            {accessory.type && !['hinge', 'slide'].includes(accessory.type) && (
              <div className="text-center text-xs text-muted-foreground">
                Configure specific properties for this accessory type
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoryForm;
