
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash } from 'lucide-react';
import { PriceBreakdownPanel } from './PriceBreakdownPanel';

interface PropertiesFooterProps {
  priceBreakdown: {
    materials: number;
    accessories: number;
    processing: number;
    labor: number;
  };
  totalPrice: number;
  showPriceBreakdown: boolean;
  setShowPriceBreakdown: (show: boolean) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const PropertiesFooter: React.FC<PropertiesFooterProps> = ({
  priceBreakdown,
  totalPrice,
  showPriceBreakdown,
  setShowPriceBreakdown,
  onSave,
  onDelete
}) => {
  return (
    <div className="border-t p-4 space-y-3">
      <PriceBreakdownPanel
        priceBreakdown={priceBreakdown}
        totalPrice={totalPrice}
        showPriceBreakdown={showPriceBreakdown}
        setShowPriceBreakdown={setShowPriceBreakdown}
      />
      
      <div className="flex items-center space-x-2">
        <Button onClick={onSave} className="flex-1">
          <Save className="h-4 w-4 mr-1" />
          Save Changes
        </Button>
        <Button 
          variant="destructive" 
          onClick={onDelete}
          size="icon"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
