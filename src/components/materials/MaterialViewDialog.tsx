
import React, { useState } from 'react';
import { Material } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTranslation } from '@/contexts/TranslationContext';
import { Badge } from '@/components/ui/badge';
import { Check, X, ZoomIn, ZoomOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaterialViewDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite?: (material: Material) => void;
}

export const MaterialViewDialog: React.FC<MaterialViewDialogProps> = ({
  material,
  open,
  onOpenChange,
  onToggleFavorite
}) => {
  const { t } = useTranslation();
  const fallbackImage = 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=500';
  const [zoomLevel, setZoomLevel] = useState(1);
  
  if (!material) return null;

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.25, 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl text-white">{material.name}</DialogTitle>
            {onToggleFavorite && (
              <Button
                variant="ghost" 
                size="sm"
                className={`gap-1 ${material.isFavorite ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => onToggleFavorite(material)}
              >
                <Star className={`h-4 w-4 ${material.isFavorite ? 'fill-yellow-400' : ''}`} />
                {material.isFavorite ? t('materials.favorite') : t('materials.addToFavorites')}
              </Button>
            )}
          </div>
          <DialogDescription className="text-gray-300">{material.code}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Material image with zoom capability */}
          <div className="aspect-square relative rounded-md overflow-hidden">
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 shadow-md text-white"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700 shadow-md text-white"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            <div 
              style={{
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                position: 'relative'
              }}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease',
                  height: '100%',
                  width: '100%',
                }}
              >
                <img 
                  src={material.textureUrl || fallbackImage} 
                  alt={material.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Material details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">{t('materials.form.details')}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('materials.form.type')}:</span>
                  <span className="text-white">{material.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('materials.form.thickness')}:</span>
                  <span className="text-white">{material.thickness}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('materials.form.manufacturer')}:</span>
                  <span className="text-white">{material.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('materials.form.supplier')}:</span>
                  <span className="text-white">{material.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('materials.form.pricePerSqm')}:</span>
                  <span className="text-white font-medium">€{material.pricePerSqm.toFixed(2)}/m²</span>
                </div>
              </div>
            </div>
            
            {/* Properties */}
            <div>
              <h3 className="text-lg font-medium text-white">{t('materials.form.properties')}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  {material.paintable ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-300">{t('materials.paintable')}</span>
                </div>
                <div className="flex items-center">
                  {material.cantable ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-300">{t('materials.cantable')}</span>
                </div>
                <div className="flex items-center">
                  {material.availability ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-300">{t('common.inStock')}</span>
                </div>
              </div>
            </div>
            
            {/* Status badge */}
            <div className="mt-4">
              <Badge className={`${material.availability ? 'bg-green-600' : 'bg-red-600'} text-white px-3 py-1`}>
                {material.availability ? t('common.inStock') : t('materials.outOfStock')}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
