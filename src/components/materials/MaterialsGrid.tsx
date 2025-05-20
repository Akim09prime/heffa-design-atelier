
import React from 'react';
import { Material } from '@/types';
import { MaterialCard } from './MaterialCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent } from '@/components/ui/card';

interface MaterialsGridProps {
  materials: Material[];
  isLoading: boolean;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
  onView: (material: Material) => void;
  onToggleFavorite: (material: Material) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const MaterialsGrid: React.FC<MaterialsGridProps> = ({
  materials,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onToggleFavorite,
  onClearFilters,
  hasActiveFilters = false
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-500 border-t-blue-500 rounded-full mb-4"></div>
          <p className="text-gray-400">{t('materials.loading')}</p>
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-gray-400 mb-4">{t('materials.noMaterialsFound')}</p>
        {hasActiveFilters && onClearFilters && (
          <Button 
            variant="outline"
            onClick={onClearFilters}
            className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
          >
            {t('materials.clearFilters')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {materials.map((material) => (
        <MaterialCard 
          key={material.id}
          material={material}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
