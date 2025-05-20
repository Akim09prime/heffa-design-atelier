
import React from 'react';
import { Material } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Image, Check, Eye } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Badge } from '@/components/ui/badge';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
  onView?: (material: Material) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onEdit,
  onDelete,
  onView
}) => {
  const { t } = useTranslation();
  const fallbackImage = 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=500';
  
  return (
    <Card className="overflow-hidden h-full flex flex-col material-card border-gray-700 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div 
        className="aspect-square relative material-image overflow-hidden"
        style={{
          backgroundImage: `url(${material.textureUrl || fallbackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Material availability badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className={`${material.availability ? 'bg-green-600' : 'bg-red-600'} text-white transition-opacity opacity-80 group-hover:opacity-100`}>
            {material.availability ? t('common.inStock') : t('materials.outOfStock')}
          </Badge>
        </div>
        
        {/* Overlay with image or placeholder */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-all">
          {!material.textureUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image className="h-12 w-12 text-gray-400 opacity-50" />
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onView && (
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 shadow-md text-white"
              onClick={(e) => {
                e.stopPropagation();
                onView(material);
              }}
              title={t('common.view')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 shadow-md text-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(material);
            }}
            title={t('common.edit')}
          >
            <Edit className="h-4 w-4" />
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
          <h3 className="font-medium text-white text-lg">{material.name}</h3>
          <p className="text-sm text-gray-300 mt-1">{material.code}</p>
          <p className="text-sm text-gray-300 mt-2">{material.manufacturer}</p>
        </div>
        <div className="flex justify-between mt-3">
          <p className="text-sm font-medium text-white">€{material.pricePerSqm.toFixed(2)}/m²</p>
          <p className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded-full">{material.thickness}mm</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {material.paintable && (
            <span className="px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-100 text-xs flex items-center">
              <Check className="h-3 w-3 mr-1" />
              {t('materials.paintable')}
            </span>
          )}
          {material.cantable && (
            <span className="px-2 py-0.5 rounded-full bg-green-900/50 text-green-100 text-xs flex items-center">
              <Check className="h-3 w-3 mr-1" />
              {t('materials.cantable')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
