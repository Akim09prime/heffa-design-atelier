
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 p-0 h-auto text-sm font-medium"
          onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
        >
          <DollarSign className="h-4 w-4" />
          Price Breakdown
        </Button>
        <span className="text-sm font-medium">${totalPrice.toFixed(2)}</span>
      </div>
      
      {/* Price breakdown details */}
      {showPriceBreakdown && (
        <div className="mt-2 text-xs space-y-1 bg-gray-50 p-2 rounded">
          <div className="flex justify-between">
            <span>Materials:</span>
            <span>${priceBreakdown.materials.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Accessories:</span>
            <span>${priceBreakdown.accessories.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing:</span>
            <span>${priceBreakdown.processing.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Labor:</span>
            <span>${priceBreakdown.labor.toFixed(2)}</span>
          </div>
          <div className="border-t pt-1 flex justify-between font-medium">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
