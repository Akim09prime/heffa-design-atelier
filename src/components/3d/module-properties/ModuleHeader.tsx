
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ModuleHeaderProps {
  name: string;
  onClose: () => void;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ name, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="font-medium">{name}</h2>
      <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
