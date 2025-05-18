
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FurnitureModule } from '@/types';
import { validateNumericInput, parseNumericInput } from '@/utils/validators';
import { useToast } from '@/hooks/use-toast';
import { showErrorToast } from '@/utils/toast';

interface ModulePositionPanelProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
}

export const ModulePositionPanel: React.FC<ModulePositionPanelProps> = ({
  module,
  onUpdate
}) => {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handlePositionChange = (axis: 0 | 1 | 2, value: string) => {
    // Validate input
    if (!validateNumericInput(value, { allowZero: true, allowNegative: true })) {
      setValidationErrors(prev => ({
        ...prev,
        [`pos-${axis}`]: 'Please enter a valid number'
      }));
      return;
    }

    // Clear validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`pos-${axis}`];
      return newErrors;
    });

    const numValue = parseFloat(value);
    const updatedModule = { ...module };
    const newPosition = [...updatedModule.position];
    newPosition[axis] = numValue;
    updatedModule.position = newPosition as [number, number, number];
    
    try {
      onUpdate(updatedModule);
    } catch (error) {
      console.error(`Error updating position axis ${axis}:`, error);
      showErrorToast(toast, `Failed to update position`, (error as Error).message);
    }
  };

  const handleBlur = (axis: 0 | 1 | 2) => {
    // If the value is invalid, reset to the previous valid value
    if (validationErrors[`pos-${axis}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`pos-${axis}`];
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
      <h3 className="text-sm font-medium mb-2">Position</h3>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((axis) => (
          <div key={`position-${axis}`}>
            <Label htmlFor={`position-${axis}`} className="text-xs">{getAxisLabel(axis)}</Label>
            <Input
              id={`position-${axis}`}
              type="number"
              step="0.1"
              value={module.position[axis]}
              onChange={(e) => handlePositionChange(axis as 0 | 1 | 2, e.target.value)}
              onBlur={() => handleBlur(axis as 0 | 1 | 2)}
              className={`h-8 ${validationErrors[`pos-${axis}`] ? 'border-red-500' : ''}`}
              aria-invalid={!!validationErrors[`pos-${axis}`]}
            />
            {validationErrors[`pos-${axis}`] && (
              <p className="text-xs text-red-500 mt-1">{validationErrors[`pos-${axis}`]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
