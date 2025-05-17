
import React from 'react';
import { Material } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
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
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="aspect-square bg-gray-100 relative"
        style={{
          backgroundImage: material.textureUrl ? `url(${material.textureUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-2 right-2 flex gap-1">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(material);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(material);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="font-medium">{material.name}</h3>
          <p className="text-sm text-muted-foreground">{material.code}</p>
          <p className="text-sm text-muted-foreground">{material.manufacturer}</p>
        </div>
        <div className="flex justify-between mt-3">
          <p className="text-sm font-medium">€{material.pricePerSqm.toFixed(2)}/m²</p>
          <p className="text-xs text-muted-foreground">{material.thickness}mm</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {material.paintable && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
              {t('materials.paintable')}
            </span>
          )}
          {material.cantable && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">
              {t('materials.cantable')}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            material.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {material.availability ? t('common.inStock') : t('materials.outOfStock')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
