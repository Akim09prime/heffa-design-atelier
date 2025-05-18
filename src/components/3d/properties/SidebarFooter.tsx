
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Save } from 'lucide-react';

interface SidebarFooterProps {
  price: number;
  onSave: () => void;
  onDelete: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ price, onSave, onDelete }) => {
  return (
    <div className="p-4 border-t">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium">Price:</span>
        <span className="font-medium">€{price.toFixed(2)}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onDelete}>
          <Trash className="h-4 w-4 mr-2" /> Delete
        </Button>
        <Button className="flex-1" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
};
