
import React from 'react';
import { Material } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Image } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation();
  const fallbackImage = 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=500';
  
  return (
    <Card className="overflow-hidden h-full flex flex-col material-card border-gray-700">
      <div 
        className="aspect-square relative material-image"
        style={{
          backgroundImage: `url(${material.textureUrl || fallbackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-10 transition-all">
          {!material.textureUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image className="h-12 w-12 text-gray-400 opacity-50" />
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(material);
            }}
            title={t('common.edit')}
          >
            <Edit className="h-4 w-4 text-white" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(material);
            }}
            title={t('common.delete')}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col bg-gray-800 text-white">
        <div className="flex-grow">
          <h3 className="font-medium text-white">{material.name}</h3>
          <p className="text-sm text-gray-300">{material.code}</p>
          <p className="text-sm text-gray-300">{material.manufacturer}</p>
        </div>
        <div className="flex justify-between mt-3">
          <p className="text-sm font-medium text-white">€{material.pricePerSqm.toFixed(2)}/m²</p>
          <p className="text-xs text-gray-300">{material.thickness}mm</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {material.paintable && (
            <span className="px-2 py-0.5 rounded-full bg-blue-900 text-blue-100 text-xs">
              {t('materials.paintable')}
            </span>
          )}
          {material.cantable && (
            <span className="px-2 py-0.5 rounded-full bg-green-900 text-green-100 text-xs">
              {t('materials.cantable')}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            material.availability ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
          }`}>
            {material.availability ? t('common.inStock') : t('materials.outOfStock')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
