
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FurnitureModule } from '@/types';
import { validateNumericInput } from '@/utils/validators';
import { useToast } from '@/hooks/use-toast';
import { showErrorToast } from '@/utils/toast';

interface ModuleRotationPanelProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
}

export const ModuleRotationPanel: React.FC<ModuleRotationPanelProps> = ({
  module,
  onUpdate
}) => {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleRotationChange = (axis: 0 | 1 | 2, value: string) => {
    // Validate input
    if (!validateNumericInput(value, { allowZero: true, allowNegative: true })) {
      setValidationErrors(prev => ({
        ...prev,
        [`rot-${axis}`]: 'Please enter a valid number'
      }));
      return;
    }

    // Clear validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`rot-${axis}`];
      return newErrors;
    });

    const numValue = parseFloat(value);
    const updatedModule = { ...module };
    const newRotation = [...updatedModule.rotation];
    newRotation[axis] = numValue;
    updatedModule.rotation = newRotation as [number, number, number];
    
    try {
      onUpdate(updatedModule);
    } catch (error) {
      console.error(`Error updating rotation axis ${axis}:`, error);
      showErrorToast(toast, `Failed to update rotation`, (error as Error).message);
    }
  };

  const handleBlur = (axis: 0 | 1 | 2) => {
    // If the value is invalid, reset to the previous valid value
    if (validationErrors[`rot-${axis}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`rot-${axis}`];
        return newErrors;
      });
    }
  };

  const getAxisLabel = (axis: number): string => {
    switch (axis) {
      case 0: return 'X';
      case 1: return 'Y';
      case 2: return 'Z';
      default: return '';
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Rotation</h3>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((axis) => (
          <div key={`rotation-${axis}`}>
            <Label htmlFor={`rotation-${axis}`} className="text-xs">{getAxisLabel(axis)}</Label>
            <Input
              id={`rotation-${axis}`}
              type="number"
              step="1"
              value={module.rotation[axis]}
              onChange={(e) => handleRotationChange(axis as 0 | 1 | 2, e.target.value)}
              onBlur={() => handleBlur(axis as 0 | 1 | 2)}
              className={`h-8 ${validationErrors[`rot-${axis}`] ? 'border-red-500' : ''}`}
              aria-invalid={!!validationErrors[`rot-${axis}`]}
            />
            {validationErrors[`rot-${axis}`] && (
              <p className="text-xs text-red-500 mt-1">{validationErrors[`rot-${axis}`]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
