
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModuleType } from '@/types';

interface ModuleTypeSelectorProps {
  type: ModuleType;
  onTypeChange: (type: ModuleType) => void;
  blockedOptions: string[];
}

export const ModuleTypeSelector: React.FC<ModuleTypeSelectorProps> = ({
  type,
  onTypeChange,
  blockedOptions
}) => {
  return (
    <div>
      <Label className="text-sm font-medium">Type</Label>
      <Select
        value={type}
        onValueChange={(value: ModuleType) => onTypeChange(value)}
      >
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
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
