
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PriceBreakdownPanelProps {
  priceBreakdown: {
    materials: number;
    accessories: number;
    processing: number;
    labor: number;
  };
  totalPrice: number;
  showPriceBreakdown: boolean;
  setShowPriceBreakdown: (show: boolean) => void;
}

export const PriceBreakdownPanel: React.FC<PriceBreakdownPanelProps> = ({
  priceBreakdown,
  totalPrice,
  showPriceBreakdown,
  setShowPriceBreakdown
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">Total Price</span>
        <div className="flex items-center justify-end">
          <span className="text-lg font-bold">{totalPrice.toFixed(2)} RON</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="ml-1 h-6 w-6 p-0" 
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
          >
            {showPriceBreakdown ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
      
      {showPriceBreakdown && (
        <div className="bg-muted rounded-md p-2 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Materials</span>
            <span>{priceBreakdown.materials.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between">
            <span>Accessories</span>
            <span>{priceBreakdown.accessories.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between">
            <span>Processing</span>
            <span>{priceBreakdown.processing.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between">
            <span>Labor</span>
            <span>{priceBreakdown.labor.toFixed(2)} RON</span>
          </div>
        </div>
      )}
    </div>
  );
};
