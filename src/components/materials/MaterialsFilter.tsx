
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Star, X, Check } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Badge } from '@/components/ui/badge';
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
  
  const hasActiveQuickFilters = showOnlyFavorites || filterAvailability !== null || searchQuery;

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
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1.5 top-1.5 h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`bg-gray-700 text-white border-gray-600 hover:bg-gray-600 ${hasActiveQuickFilters ? 'border-blue-500 ring-1 ring-blue-500/30' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('materials.filter')}
            {hasActiveQuickFilters && (
              <Badge className="ml-2 bg-blue-600 text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                {(showOnlyFavorites ? 1 : 0) + (filterAvailability !== null ? 1 : 0) + (searchQuery ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-56">
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
            className={`${filterAvailability === true ? 'bg-blue-800' : ''} cursor-pointer hover:bg-gray-700 flex justify-between`}
            onClick={() => onFilterAvailability(filterAvailability === true ? null : true)}
          >
            {t('common.inStock')}
            {filterAvailability === true && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`${filterAvailability === false ? 'bg-blue-800' : ''} cursor-pointer hover:bg-gray-700 flex justify-between`}
            onClick={() => onFilterAvailability(filterAvailability === false ? null : false)}
          >
            {t('materials.outOfStock')}
            {filterAvailability === false && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className={`text-gray-300 cursor-pointer hover:bg-gray-700 ${!hasActiveQuickFilters ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={hasActiveQuickFilters ? onClearFilters : undefined}
          >
            {t('materials.clearFilters')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
