
import React, { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Filter, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MaterialsAdvancedFilterProps {
  manufacturers: string[];
  thicknesses: number[];
  minPrice: number;
  maxPrice: number;
  selectedManufacturer: string | null;
  selectedThickness: number | null;
  priceRange: [number, number];
  onManufacturerChange: (manufacturer: string | null) => void;
  onThicknessChange: (thickness: number | null) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export const MaterialsAdvancedFilter: React.FC<MaterialsAdvancedFilterProps> = ({
  manufacturers,
  thicknesses,
  minPrice,
  maxPrice,
  selectedManufacturer,
  selectedThickness,
  priceRange,
  onManufacturerChange,
  onThicknessChange,
  onPriceRangeChange,
  onClearFilters
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  
  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
  };

  const applyPriceFilter = () => {
    onPriceRangeChange(localPriceRange);
  };

  const activeFilterCount = (selectedManufacturer ? 1 : 0) + 
                            (selectedThickness ? 1 : 0) +
                            (priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 relative">
          <Filter className="h-4 w-4 mr-2" />
          {t('materials.advancedFilters')}
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-white p-4">
        <div className="space-y-4">
          <h3 className="font-medium text-lg mb-2">{t('materials.advancedFilters')}</h3>
          
          {/* Manufacturer filter */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">{t('materials.manufacturer')}</Label>
            <Select 
              value={selectedManufacturer || 'all'} 
              onValueChange={(value) => onManufacturerChange(value === 'all' ? null : value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder={t('materials.allManufacturers')} />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">
                  {t('materials.allManufacturers')}
                </SelectItem>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedManufacturer && (
              <div className="flex items-center">
                <Badge className="bg-blue-900/50 text-blue-100 flex items-center gap-1">
                  {selectedManufacturer}
                  <button 
                    className="ml-1 hover:text-white" 
                    onClick={() => onManufacturerChange(null)}
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </div>
          
          {/* Thickness filter */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">{t('materials.thickness')}</Label>
            <Select 
              value={selectedThickness?.toString() || 'all'} 
              onValueChange={(value) => onThicknessChange(value === 'all' ? null : Number(value))}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder={t('materials.allThicknesses')} />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">
                  {t('materials.allThicknesses')}
                </SelectItem>
                {thicknesses.map((thickness) => (
                  <SelectItem key={thickness} value={thickness.toString()}>
                    {thickness} mm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedThickness && (
              <div className="flex items-center">
                <Badge className="bg-green-900/50 text-green-100 flex items-center gap-1">
                  {selectedThickness} mm
                  <button 
                    className="ml-1 hover:text-white" 
                    onClick={() => onThicknessChange(null)}
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </div>
          
          {/* Price range filter */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-gray-300">{t('materials.priceRange')}</Label>
              <div className="text-sm text-gray-300">
                €{localPriceRange[0].toFixed(2)} - €{localPriceRange[1].toFixed(2)}
              </div>
            </div>
            <Slider
              defaultValue={[minPrice, maxPrice]}
              min={minPrice}
              max={maxPrice}
              step={0.1}
              value={localPriceRange}
              onValueChange={handlePriceChange}
              onValueCommit={applyPriceFilter}
              className="mt-2"
            />
          </div>
          
          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-300 hover:text-white bg-transparent border-gray-600"
              onClick={onClearFilters}
            >
              {t('materials.clearFilters')}
            </Button>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-500"
              onClick={() => setOpen(false)}
            >
              <Check className="h-4 w-4 mr-1" />
              {t('common.apply')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
