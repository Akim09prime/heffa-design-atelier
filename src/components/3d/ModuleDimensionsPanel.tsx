
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FurnitureModule } from '@/types';
import { validateNumericInput, parseNumericInput } from '@/utils/validators';
import { useToast } from '@/hooks/use-toast';
import { showErrorToast } from '@/utils/toast';
import { useAutoSave } from '@/hooks/useAutoSave';

// Helper to format measurements
const formatMeasurement = (value: number) => {
  return `${value}mm`;
};

interface ModuleDimensionsPanelProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
}

export const ModuleDimensionsPanel: React.FC<ModuleDimensionsPanelProps> = ({
  module,
  onUpdate
}) => {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [editedModule, setEditedModule] = useState<FurnitureModule>(module);

  // Auto-save functionality
  useAutoSave({
    data: editedModule,
    onSave: async (data) => {
      if (Object.keys(validationErrors).length === 0) {
        onUpdate(data);
      }
    },
    debounceMs: 1000
  });

  const handleDimensionChange = (dimension: 'width' | 'height' | 'depth', value: string) => {
    // Validate input
    if (!validateNumericInput(value, { min: 1 })) {
      setValidationErrors(prev => ({
        ...prev,
        [dimension]: 'Please enter a valid number greater than 0'
      }));
      return;
    }

    // Clear validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[dimension];
      return newErrors;
    });

    // Update module with parsed value
    const numValue = parseFloat(value);
    setEditedModule(prev => ({
      ...prev,
      [dimension]: numValue
    }));
  };

  const handleBlur = (dimension: 'width' | 'height' | 'depth') => {
    // If the value is invalid, reset to the previous valid value
    if (validationErrors[dimension]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[dimension];
        return newErrors;
      });
      
      // Reset to the original value
      setEditedModule(prev => ({
        ...prev,
        [dimension]: module[dimension]
      }));
    } else {
      // If valid on blur, update the parent
      onUpdate(editedModule);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Dimensions</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="width" className="text-xs">Width</Label>
          <Input
            id="width"
            type="number"
            value={editedModule.width}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            onBlur={() => handleBlur('width')}
            className={`h-8 ${validationErrors.width ? 'border-red-500' : ''}`}
            aria-invalid={!!validationErrors.width}
          />
          {validationErrors.width ? (
            <p className="text-xs text-red-500 mt-1">{validationErrors.width}</p>
          ) : (
            <div className="text-xs text-gray-500 mt-1">{formatMeasurement(editedModule.width)}</div>
          )}
        </div>
        <div>
          <Label htmlFor="height" className="text-xs">Height</Label>
          <Input
            id="height"
            type="number"
            value={editedModule.height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            onBlur={() => handleBlur('height')}
            className={`h-8 ${validationErrors.height ? 'border-red-500' : ''}`}
            aria-invalid={!!validationErrors.height}
          />
          {validationErrors.height ? (
            <p className="text-xs text-red-500 mt-1">{validationErrors.height}</p>
          ) : (
            <div className="text-xs text-gray-500 mt-1">{formatMeasurement(editedModule.height)}</div>
          )}
        </div>
        <div>
          <Label htmlFor="depth" className="text-xs">Depth</Label>
          <Input
            id="depth"
            type="number"
            value={editedModule.depth}
            onChange={(e) => handleDimensionChange('depth', e.target.value)}
            onBlur={() => handleBlur('depth')}
            className={`h-8 ${validationErrors.depth ? 'border-red-500' : ''}`}
            aria-invalid={!!validationErrors.depth}
          />
          {validationErrors.depth ? (
            <p className="text-xs text-red-500 mt-1">{validationErrors.depth}</p>
          ) : (
            <div className="text-xs text-gray-500 mt-1">{formatMeasurement(editedModule.depth)}</div>
          )}
        </div>
      </div>
    </div>
  );
};
