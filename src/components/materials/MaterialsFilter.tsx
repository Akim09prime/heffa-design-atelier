
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Star } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MaterialsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterAvailability: boolean | null;
  onFilterAvailability: (value: boolean | null) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  onClearFilters: () => void;
}

export const MaterialsFilter: React.FC<MaterialsFilterProps> = ({
  searchQuery,
  onSearchChange,
  filterAvailability,
  onFilterAvailability,
  showOnlyFavorites,
  onToggleFavorites,
  onClearFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap w-full gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('materials.searchPlaceholder')}
          className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {t('materials.filter')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
          <DropdownMenuLabel>{t('materials.filterBy')}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className={`${showOnlyFavorites ? 'bg-blue-800' : ''} cursor-pointer hover:bg-gray-700`}
            onClick={onToggleFavorites}
          >
            <Star className={`h-4 w-4 mr-2 ${showOnlyFavorites ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {t('materials.favorites')}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className={`${filterAvailability === true ? 'bg-blue-800' : ''} cursor-pointer hover:bg-gray-700`}
            onClick={() => onFilterAvailability(true)}
          >
            {t('common.inStock')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`${filterAvailability === false ? 'bg-blue-800' : ''} cursor-pointer hover:bg-gray-700`}
            onClick={() => onFilterAvailability(false)}
          >
            {t('materials.outOfStock')}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className="text-gray-300 cursor-pointer hover:bg-gray-700"
            onClick={onClearFilters}
          >
            {t('materials.clearFilters')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
