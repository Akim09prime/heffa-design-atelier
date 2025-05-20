
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Material } from '@/types';
import { MaterialForm } from '@/components/materials/MaterialForm';
import { MaterialViewDialog } from '@/components/materials/MaterialViewDialog';
import { useTranslation, TranslationProvider } from '@/contexts/TranslationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useMaterialsManagement } from '@/hooks/useMaterialsManagement';
import { MaterialsFilter } from '@/components/materials/MaterialsFilter';
import { MaterialsGrid } from '@/components/materials/MaterialsGrid';

// Create a wrapper component that uses the contexts
const MaterialsContent = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const {
    materialType,
    filteredMaterials,
    searchQuery,
    isLoading,
    selectedMaterial,
    filterAvailability,
    showOnlyFavorites,
    setSelectedMaterial,
    setSearchQuery,
    handleTabChange,
    handleToggleFavoritesFilter,
    handleFilterAvailability,
    handleClearFilters,
    handleAddMaterial,
    handleUpdateMaterial,
    handleDeleteMaterial,
    handleToggleFavorite,
    hasActiveFilters
  } = useMaterialsManagement();
  
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

  // Function to render tab content for each material type
  const renderTabContent = (type: string) => {
    const typeName = type.toUpperCase();
    
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-white">{typeName} {t('materials.materials')}</CardTitle>
          <CardDescription className="text-gray-400">
            {typeName} {t('materials.materialsFrom')} {filteredMaterials.length} {t('materials.entries')}
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
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">{t('materials.title')}</h1>
            <p className="text-gray-300">{t('materials.description')}</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-2">
            <MaterialsFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterAvailability={filterAvailability}
              onFilterAvailability={handleFilterAvailability}
              showOnlyFavorites={showOnlyFavorites}
              onToggleFavorites={handleToggleFavoritesFilter}
              onClearFilters={handleClearFilters}
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

        <Tabs 
          defaultValue="pal" 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="pal">PAL</TabsTrigger>
            <TabsTrigger value="mdf">MDF</TabsTrigger>
            <TabsTrigger value="mdf-agt">MDF-AGT</TabsTrigger>
            <TabsTrigger value="pfl">PFL</TabsTrigger>
            <TabsTrigger value="glass">{t('materials.glass')}</TabsTrigger>
            <TabsTrigger value="countertop">{t('materials.countertops')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pal" className="w-full">
            {renderTabContent('pal')}
          </TabsContent>
          
          {['mdf', 'mdf-agt', 'pfl', 'glass', 'countertop'].map((type) => (
            <TabsContent key={type} value={type} className="w-full">
              {renderTabContent(type)}
            </TabsContent>
          ))}
        </Tabs>
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
                const success = await handleUpdateMaterial(selectedMaterial, formData);
                if (success) {
                  setIsEditDialogOpen(false);
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
