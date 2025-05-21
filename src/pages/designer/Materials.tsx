
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/contexts/TranslationContext';
import { MaterialService } from '@/services/materialService';
import { Material, MaterialType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { showSuccessToast } from '@/utils/toast';
import { DesignerLayout } from '@/components/layout/DesignerLayout';

// Create a MaterialsContent component that uses hooks
const Materials = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [materialType, setMaterialType] = useState<MaterialType>('PAL');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const fetchedMaterials = await MaterialService.getMaterialsByType(materialType);
        setMaterials(fetchedMaterials);
        setFilteredMaterials(fetchedMaterials);
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: t('common.error'),
          description: t('materials.failedToLoad'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, [materialType, toast, t]);

  // Filter materials when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = materials.filter(material => 
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(materials);
    }
  }, [searchQuery, materials]);

  const handleAddToProject = (material: Material) => {
    showSuccessToast(toast, t('materials.materialAdded'), `${material.name} ${t('materials.addedToProject')}`);
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium">{t('materials.title')}</h1>
            <p className="text-muted-foreground">{t('designer.materials.subtitle')}</p>
          </div>
          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('materials.searchPlaceholder')}
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('common.filter')}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pal" onValueChange={(value) => setMaterialType(value.toUpperCase() as MaterialType)}>
          <TabsList className="mb-6">
            <TabsTrigger value="pal">PAL</TabsTrigger>
            <TabsTrigger value="mdf">MDF</TabsTrigger>
            <TabsTrigger value="mdf-agt">MDF-AGT</TabsTrigger>
            <TabsTrigger value="pfl">PFL</TabsTrigger>
            <TabsTrigger value="glass">{t('materials.glass')}</TabsTrigger>
            <TabsTrigger value="countertop">{t('materials.countertops')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pal">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>{t('materials.loading')}</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center p-12 text-center">
                  <p>{t('materials.noMaterialsFound')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMaterials.map((material) => (
                  <Card key={material.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => handleAddToProject(material)}>
                    <div 
                      className="aspect-square bg-gray-100"
                      style={{
                        backgroundImage: material.textureUrl ? `url(${material.textureUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <CardContent className="p-4">
                      <h3 className="font-medium">{material.code}</h3>
                      <p className="text-sm text-muted-foreground">{material.name}</p>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm font-medium">€{material.pricePerSqm.toFixed(2)}/m²</p>
                        <p className="text-xs text-muted-foreground">{material.thickness}mm</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {['mdf', 'mdf-agt', 'pfl', 'glass', 'countertop'].map((type) => (
            <TabsContent key={type} value={type}>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>{t('materials.loading')}</p>
                </div>
              ) : filteredMaterials.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center p-12 text-center">
                    <p>{t('materials.noMaterialsFound')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredMaterials.map((material) => (
                    <Card key={material.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
                      onClick={() => handleAddToProject(material)}>
                      <div 
                        className="aspect-square bg-gray-100"
                        style={{
                          backgroundImage: material.textureUrl ? `url(${material.textureUrl})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <CardContent className="p-4">
                        <h3 className="font-medium">{material.code}</h3>
                        <p className="text-sm text-muted-foreground">{material.name}</p>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm font-medium">€{material.pricePerSqm.toFixed(2)}/m²</p>
                          <p className="text-xs text-muted-foreground">{material.thickness}mm</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default Materials;
