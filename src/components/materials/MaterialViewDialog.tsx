
import React from 'react';
import { Material } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTranslation } from '@/contexts/TranslationContext';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface MaterialViewDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MaterialViewDialog: React.FC<MaterialViewDialogProps> = ({
  material,
  open,
  onOpenChange
}) => {
  const { t } = useTranslation();
  const fallbackImage = 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=500';
  
  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">{material.name}</DialogTitle>
          <DialogDescription className="text-gray-300">{material.code}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Material image */}
          <div className="aspect-square relative rounded-md overflow-hidden">
            <img 
              src={material.textureUrl || fallbackImage} 
              alt={material.name}
              className="w-full h-full object-cover"
            />
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
