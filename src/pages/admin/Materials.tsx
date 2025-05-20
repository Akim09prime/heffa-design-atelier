
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Material } from '@/types';
import { MaterialForm } from '@/components/materials/MaterialForm';
import { MaterialViewDialog } from '@/components/materials/MaterialViewDialog';
import { useTranslation, TranslationProvider } from '@/contexts/TranslationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { MaterialsFilter } from '@/components/materials/MaterialsFilter';
import { MaterialsGrid } from '@/components/materials/MaterialsGrid';
import { MaterialCategoryTabs } from '@/components/materials/MaterialCategoryTabs';
import { MaterialsAdvancedFilter } from '@/components/materials/MaterialsAdvancedFilter';
import { useMaterialsFilters } from '@/hooks/useMaterialsFilters';
import { MaterialService } from '@/services/materialService';

// Create a wrapper component that uses the contexts
const MaterialsContent = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        const allMaterials = await MaterialService.getAllMaterials();
        setMaterials(allMaterials);
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: t('common.error'),
          description: t('materials.fetchError'),
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, [toast, t]);
  
  // Use our custom hook for filtering
  const {
    searchQuery,
    categoryFilter,
    manufacturerFilter,
    thicknessFilter,
    priceRangeFilter,
    showOnlyFavorites,
    availabilityFilter,
    manufacturers,
    thicknesses,
    minPrice,
    maxPrice,
    filteredMaterials,
    setSearchQuery,
    setCategoryFilter,
    setManufacturerFilter,
    setThicknessFilter,
    setPriceRangeFilter,
    setShowOnlyFavorites,
    setAvailabilityFilter,
    clearFilters,
    hasActiveFilters
  } = useMaterialsFilters(materials);
  
  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setViewDialogOpen(true);
  };

  const handleImportMaterials = () => {
    toast({
      title: t('common.import'),
      description: t('materials.importFunctionality'),
    });
  };
  
  const handleExportMaterials = () => {
    toast({
      title: t('common.export'),
      description: t('materials.exportFunctionality'),
    });
  };
  
  const handleAddMaterial = async (formData: Omit<Material, 'id'>) => {
    try {
      const newMaterial = await MaterialService.addMaterial({
        ...formData,
        type: categoryFilter as any
      });
      
      setMaterials(prevMaterials => [...prevMaterials, newMaterial]);
      
      toast({
        title: t('materials.addSuccess'),
        description: t('materials.materialAddedSuccess')
      });
      
      return true;
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.addError'),
        variant: 'destructive'
      });
      return false;
    }
  };
  
  const handleUpdateMaterial = async (material: Material, formData: Partial<Material>) => {
    try {
      const updatedMaterial = await MaterialService.updateMaterial(material.id, formData);
      
      setMaterials(prevMaterials => 
        prevMaterials.map(m => m.id === updatedMaterial.id ? updatedMaterial : m)
      );
      
      if (selectedMaterial && selectedMaterial.id === updatedMaterial.id) {
        setSelectedMaterial(updatedMaterial);
      }
      
      toast({
        title: t('materials.updateSuccess'),
        description: t('materials.materialUpdatedSuccess')
      });
      
      return true;
    } catch (error) {
      console.error('Error updating material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.updateError'),
        variant: 'destructive'
      });
      return false;
    }
  };
  
  const handleDeleteMaterial = async (material: Material) => {
    if (!window.confirm(t('materials.confirmDelete'))) return;
    
    try {
      await MaterialService.deleteMaterial(material.id);
      
      setMaterials(prevMaterials => 
        prevMaterials.filter(m => m.id !== material.id)
      );
      
      toast({
        title: t('materials.deleteSuccess'),
        description: t('materials.materialDeletedSuccess')
      });
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.deleteError'),
        variant: 'destructive'
      });
    }
  };
  
  const handleToggleFavorite = async (material: Material) => {
    try {
      const updatedMaterial = await MaterialService.toggleFavorite(material.id);
      
      setMaterials(prevMaterials => 
        prevMaterials.map(m => m.id === updatedMaterial.id ? updatedMaterial : m)
      );
      
      if (selectedMaterial && selectedMaterial.id === updatedMaterial.id) {
        setSelectedMaterial(updatedMaterial);
      }
      
      toast({
        title: updatedMaterial.isFavorite ? t('materials.addedToFavorites') : t('materials.removedFromFavorites'),
        description: t('materials.favoritesUpdated')
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: t('common.error'),
        description: t('materials.favoriteError'),
        variant: 'destructive'
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">{t('materials.title')}</h1>
            <p className="text-gray-300">{t('materials.description')}</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-2 items-center">
            <MaterialsFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterAvailability={availabilityFilter}
              onFilterAvailability={setAvailabilityFilter}
              showOnlyFavorites={showOnlyFavorites}
              onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
              onClearFilters={clearFilters}
            />
            
            <MaterialsAdvancedFilter
              manufacturers={manufacturers}
              thicknesses={thicknesses}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedManufacturer={manufacturerFilter}
              selectedThickness={thicknessFilter}
              priceRange={priceRangeFilter}
              onManufacturerChange={setManufacturerFilter}
              onThicknessChange={setThicknessFilter}
              onPriceRangeChange={setPriceRangeFilter}
              onClearFilters={clearFilters}
            />
            
            <Button variant="outline" onClick={handleImportMaterials} className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              <Upload className="h-4 w-4 mr-2" />
              {t('common.import')}
            </Button>
            <Button variant="outline" onClick={handleExportMaterials} className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 text-white hover:bg-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              {t('materials.addMaterial')}
            </Button>
          </div>
        </div>

        <MaterialCategoryTabs
          currentCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
          
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white">
              {categoryFilter} {t('materials.materials')}
              {hasActiveFilters && (
                <span className="text-sm text-gray-400 ml-2">
                  ({filteredMaterials.length} {t('materials.filtered')})
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {categoryFilter} {t('materials.materialsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <MaterialsGrid 
              materials={filteredMaterials}
              isLoading={isLoading}
              onEdit={handleEditMaterial}
              onDelete={handleDeleteMaterial}
              onView={handleViewMaterial}
              onToggleFavorite={handleToggleFavorite}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add Material Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('materials.addNewMaterial')}</DialogTitle>
          </DialogHeader>
          <MaterialForm 
            onSubmit={async (formData) => {
              const success = await handleAddMaterial(formData);
              if (success) {
                setIsAddDialogOpen(false);
              }
            }}
            onCancel={() => setIsAddDialogOpen(false)}
            initialType={categoryFilter}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('materials.editMaterial')}</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <MaterialForm 
              material={selectedMaterial}
              onSubmit={async (formData) => {
                if (selectedMaterial) {
                  const success = await handleUpdateMaterial(selectedMaterial, formData);
                  if (success) {
                    setIsEditDialogOpen(false);
                  }
                }
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Material Dialog */}
      <MaterialViewDialog 
        material={selectedMaterial}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onToggleFavorite={handleToggleFavorite}
      />
    </AdminLayout>
  );
};

// Main Materials component wrapped with providers
const Materials = () => {
  return (
    <TranslationProvider>
      <AuthProvider>
        <MaterialsContent />
      </AuthProvider>
    </TranslationProvider>
  );
};

export default Materials;
